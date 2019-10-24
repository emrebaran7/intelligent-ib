require "Nokogiri"
require "HTTParty"
require "Pry"
require "byebug"

class String
    def include_all?(array)
        array.all? {|i| self.include? i}
    end

    def include_any?(array)
        array.any? {|i| self.include? i}
    end
end

## get parsed tables
def get_parsed_tables(tables)
    parsed_tables = []
    tables.each do |table|
        parsed_table = []
        cells = table.search('tr').each do |tr|
            cells = tr.search('th, td, tr')
            parsed_cells = []
            cells.each do |cell|
                text = cell.text.strip.gsub(/[\u200B-\u200D\uFEFF]/, '').gsub(/\u00a0/, '')
                parsed_cells << text unless text == ""
            end
            parsed_table << parsed_cells
        end
        parsed_tables << parsed_table
    end

    parsed_tables
end

### get_issuance_info
def get_issuance_info(parsed_tables, page_url)
    issuance_tables = []

    parsed_tables.each do |table|
        table = table.flatten
        issuance_tables << table if table.to_s.downcase.include_all?(["underwrit","proceeds","price"])
    end

    issuance = Array.new(2) {Array.new}
    begin
        issuance_tables[0].each do |ele|
            new_ele = ""
            ele.each_char { |char| new_ele += char unless (char == "," || char == "$")}
            if new_ele.to_f != 0.0 && new_ele.to_f < 100000
                issuance[0] << new_ele.to_f if new_ele.to_f != 0.0
            else
                issuance[1] << new_ele.to_f if new_ele.to_f != 0.0
            end
        end
    rescue => exception
        errors["issuance parse problem"] = page_url
    end

        
    issuance.map!{|subarr| subarr.sort} 

    price_to_public = Hash.new
    price_to_public[:per_share] = issuance[0][1]
    price_to_public[:total] = issuance[1][1]

    underwriting_discount_and_commissions = Hash.new
    underwriting_discount_and_commissions[:per_share] = issuance[0][0]
    underwriting_discount_and_commissions[:total] = issuance[1][0]

    proceeds_to_firm = Hash.new
    proceeds_to_firm[:per_share] = issuance[0][-1]
    proceeds_to_firm[:total] = issuance[1][-1]

    doc_id = page_url.split("/")[7].delete('-').delete('.txt')

    offering_details = Hash.new

    offering_details[doc_id] = {
        :price_to_public => price_to_public, 
        :underwriting_discount_and_commissions => underwriting_discount_and_commissions, 
        :proceeds_to_firm => proceeds_to_firm
    }

    offering_details
end

## get_underwriting_info
def get_underwriting_info(parsed_tables, page_url)
    underwriting_tables = []

    parsed_tables.each do |table|
        lookup_table = table.flatten.map!(&:downcase)
        
        if lookup_table.to_s.include_any?(["& co","&co","Inc","Inc.","LLC","L.L.C."])
            
            underwriting_tables << table
        end
    end

    begin
        underwriters = underwriting_tables[-1].flatten
    rescue => exception
        underwriters = underwriting_tables[-1]
    end

    begin
        new_underwriters = []
        underwriters.each do |ele|
            new_ele = ""
            ele.each_char { |char| new_ele += char unless char == ","}
            if new_ele.to_f == 0.0
                new_underwriters << new_ele
            else
                new_underwriters << new_ele.to_f
            end
        end
    rescue => exception
       errors [page_url, "underwriters parse problem"]
    end


    floats_idx = []
    begin
        total = new_underwriters[new_underwriters.map{|ele| ele.downcase if ele.is_a?(String)}.index("total")+1]
    rescue => exception
        total = "1"
    end

    new_underwriters.each_with_index {|e,i| floats_idx.push(i) if e.is_a?(Float)}

    begin
        underwriters = new_underwriters[(floats_idx.first)-1..-3]
    rescue => exception
        errors["underwriters parse problem"] = page_url
    end

    underwriting = Hash.new

    i = 0

    begin
        while i < underwriters.length - 2
            inner_hash = Hash.new
            inner_hash[:shares] = underwriters[i+1]
            inner_hash[:allotment] = underwriters[i+1]/total
            
            underwriting[underwriters[i]] = inner_hash
            
            i += 2
        end
    rescue => exception
        errors["underwriters parse problem"] = page_url
    end

    doc_id = page_url.split("/")[7].delete('-').delete('.txt')

    underwriting_details = Hash.new
    underwriting_details[doc_id] = underwriting

    underwriting_details
end

def combine_hash(issuance_info, underwriting_info)
    cc = issuance_info
    cc[underwriting_info.keys[0]][:underwriters] = underwriting_info.values[0]
    return cc
end

page_url_array = []

CSV.foreach("/Users/emreersolmaz/Desktop/AppAcademy/Intelligent-IB/assets/file_urls.csv") do |csv_row|
    page_url_array << csv_row
end

page_url_array = page_url_array.flatten

results = Hash.new

errors = Hash.new

page_url_array.each do |page_url|
    page = HTTParty.get(page_url)
    document = Nokogiri::HTML(page)
    tables = document.search('table')
    parsed_tables = get_parsed_tables(tables)
    issuance_info = get_issuance_info(parsed_tables, page_url)
    underwriting_info = get_underwriting_info(parsed_tables, page_url)    
    doc_id = page_url.split("/")[7].delete('-').delete('.txt')
    results[doc_id] = combine_hash(issuance_info, underwriting_info)
    p "Parse succesful!" + page_url unless errors.values.to_s.include?(page_url)
end

p "total number of errors: " + errors.values.length.to_s

# p JSON.pretty_generate( results, :indent => "\t" )

File.open("/Users/emreersolmaz/Desktop/AppAcademy/Intelligent-IB/assets/data.json", "w") { |f| f.write JSON.pretty_generate( results, :indent => "\t" )}
File.open("/Users/emreersolmaz/Desktop/AppAcademy/Intelligent-IB/assets/errors.json", "w") { |f| f.write JSON.pretty_generate( errors, :indent => "\t" )}


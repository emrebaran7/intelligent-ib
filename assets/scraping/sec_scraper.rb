require "Nokogiri"
require "HTTParty"
require "Pry"
require "byebug"
require_relative "csv"

class String
    def include_all?(array)
        array.all? {|i| self.include? i}
    end

    def include_any?(array)
        array.any? {|i| self.include? i}
    end
end
def get_company_info(sec_header)
    company_info = {:company_name => nil, :CIK => nil, :SIC => nil}
    parsed_sec_header = sec_header.text.gsub('\n','').split("\t").reject{|el| el == ""}
    parsed_sec_header.each_index do |idx|
        company_info[:company_name] = parsed_sec_header[idx + 1].delete("\n") if parsed_sec_header[idx] == "COMPANY CONFORMED NAME:"
        company_info[:CIK] = parsed_sec_header[idx + 1].delete("\n") if parsed_sec_header[idx] == "CENTRAL INDEX KEY:"
        company_info[:SIC] = parsed_sec_header[idx + 1].delete("\n").split("[")[-1][0..-2] if parsed_sec_header[idx] == "STANDARD INDUSTRIAL CLASSIFICATION:"  
    end
    
    return company_info
end

# get parsed tables
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

# get_issuance_info
def get_issuance_info(parsed_tables, page_url)
    issuance_tables = []

    parsed_tables.each do |table|
        table = table.flatten
        issuance_tables << table if table.to_s.downcase.include_all?(["underwrit","proceeds","price"])
    end

    issuance = Array.new(2) {Array.new}
    issuance_tables[0].each do |ele|
        new_ele = ""
        ele.each_char { |char| new_ele += char unless (char == "," || char == "$")}
        if new_ele.to_f != 0.0 && new_ele.to_f < 100000
            issuance[0] << new_ele.to_f if new_ele.to_f != 0.0
        else
            issuance[1] << new_ele.to_f if new_ele.to_f != 0.0
        end
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

    offering_details = {
        :price_to_public => price_to_public, 
        :underwriting_discount_and_commissions => underwriting_discount_and_commissions, 
        :proceeds_to_firm => proceeds_to_firm
    }

    offering_details
end

# get_underwriting_info
def get_underwriting_info(parsed_tables, page_url)
    underwriting_tables = []

    parsed_tables.each do |table|
        lookup_table = table.flatten
        
        if lookup_table.to_s.include_any?([" & Co"," &Co"," Inc"," Inc."," LLC"," L.L.C.", ", LLC"]) && lookup_table.to_s.downcase.include_any?(["number","shares"]) && lookup_table.to_s.downcase.include?("total")
            underwriting_tables << table
        end
    end

    begin
        underwriters = underwriting_tables[-1].flatten
    rescue => exception
        underwriters = underwriting_tables[-1]
    end

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

    floats_idx = []
    total = new_underwriters[new_underwriters.map{|ele| ele.downcase if ele.is_a?(String)}.index("total")+1]
    
  
    new_underwriters.each_with_index {|e,i| floats_idx.push(i) if e.is_a?(Float)}

    if new_underwriters[(floats_idx.first)-1..-3].last.to_s.downcase == "total"
        underwriters = new_underwriters[(floats_idx.first)-1..-4]
    else
        underwriters = new_underwriters[(floats_idx.first)-1..-3]
    end
    
    u_strings = []
    underwriters.each_with_index do |ele, idx|
        u_strings << idx if ele.is_a?(String)
    end

    new_uw = []
    u_strings.each do |ele|
        new_uw << [underwriters[ele], underwriters[ele +1]]
    end
    
    underwriters = new_uw.flatten

    underwriting = Hash.new
    
    i = 0

    while i < underwriters.length - 2
        inner_hash = Hash.new
        inner_hash[:shares] = underwriters[i+1]
        inner_hash[:allotment] = underwriters[i+1]/total
        
        underwriting[underwriters[i]] = inner_hash
        
        i += 2
    end
    underwriting_info = Hash.new
    underwriting_info[:underwriters] = underwriting
    underwriting_info
end

results = []
errors = Hash.new
errors[:issuance_parse_error] = []
errors[:underwriting_parse_error] = []

ipos = IPOList.get_parsed_table 

ipos.each_with_index do |row,i|
    page_url = row[:file_path]
    page = HTTParty.get(page_url)
    document = Nokogiri::HTML(page)
    sec_header = document.search("sec-header")
    tables = document.search('table')
    parsed_tables = get_parsed_tables(tables)
    current_parse_idx = "(" + (i + 1).to_s + "/" + ipos.length.to_s + ")"
    company_info = get_company_info(sec_header)

    begin
        issuance_info = get_issuance_info(parsed_tables, page_url)
    rescue => exception
        errors[:issuance_parse_error] << page_url
        issuance_info = {
            :price_to_public => nil, 
            :underwriting_discount_and_commissions => nil, 
            :proceeds_to_firm => nil
        }
        p "Issuance parse error: " + current_parse_idx + " " + page_url
    end

    begin
        underwriting_info = get_underwriting_info(parsed_tables, page_url)    
    rescue => exception
        errors[:underwriting_parse_error] << page_url
        underwriting_info = {:underwriters => nil}
        p "Underwriting parse error: " + current_parse_idx + " " + page_url
    end

    issuance_info.each do |k,v|
        row[k] = v
    end

    underwriting_info.each do |k,v|
        row[k] = v
    end
    
    company_info.each do |k,v|
        row[k] = v
    end
    
    results.push(row)

    p "Parse succesful!: " + current_parse_idx + " " + page_url unless errors[:issuance_parse_error].include?(page_url) || errors[:underwriting_parse_error].include?(page_url)
end

p "total number of errors: " + (errors[:issuance_parse_error].length + errors[:underwriting_parse_error].length).to_s

# p JSON.pretty_generate( results, :indent => "\t" )

File.open("/Users/emreersolmaz/Desktop/Intelligent-IB/assets/data/processed/new_data.json", "w") { |f| f.write JSON.pretty_generate( results, :indent => "\t" )}
File.open("/Users/emreersolmaz/Desktop/AppAcademy/Intelligent-IB/assets/errors.json", "w") { |f| f.write JSON.pretty_generate( errors, :indent => "\t" )}


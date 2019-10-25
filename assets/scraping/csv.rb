require 'csv'
require 'byebug'
require 'date'

module IPOList
    @table = CSV.parse(File.read("/Users/emreersolmaz/Desktop/Intelligent-IB/assets/data/raw/ipo_database.csv"), headers: true)
    @file_url_table = []

    def self.get_parsed_table
        @table.each do |row|
            filename = row["filename"]
            doc_id = filename.delete("-").delete(".txt").split("/")[-1]
            base = "https://www.sec.gov/Archives/"
            url = base + filename
            url_list_item = Hash.new
            url_list_item[:doc_id] = doc_id
            url_list_item[:file_path] = url
            url_list_item[:date_filed] = DateTime.parse(row[2])
            # url_list_item[:company_name] = row[1]
            # url_list_item[:CIK] = row[0]
            @file_url_table << url_list_item
        end
        
        @file_url_table
    end
end



# file_urls = file_url_table.map {|row| row[:file_path]} 

# CSV.open("/Users/emreersolmaz/Desktop/AppAcademy/Intelligent-IB/assets/file_urls.csv", "wb") do |csv|
#     file_urls.each do |row|
#         csv << [row]
#     end
# end
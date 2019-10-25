require 'CSV'

file_urls = []

csv = CSV.read('/Users/emreersolmaz/Desktop/AppAcademy/Intelligent-IB/assets/new_file_urls.csv')

csv.flatten.each do |ele| 
    base = "https://www.sec.gov/Archives/"
    file_urls.push( base + ele )
end

CSV.open("/Users/emreersolmaz/Desktop/AppAcademy/Intelligent-IB/assets/file_urls.csv", "w") do |csv|
    file_urls.each do |row|
        csv << [row]
    end
end

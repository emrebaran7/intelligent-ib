COPY (SELECT cik, company_name, date_filed, sec_filings.filename, id FROM sec_filings where form_type = '424B4') 
TO '/Users/emreersolmaz/Desktop/Intelligent-IB/assets/data/raw/prospectuses.csv' with CSV DELIMITER ',';
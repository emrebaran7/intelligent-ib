# Intelligent IB: A Data Visualization Tool for Investment Banks

## Background & Overview

U.S. Securities Exchange Commision (SEC) publishes all forms submitted by firms whose securities are publicly traded on its EDGAR platform (https://www.sec.gov/edgar/searchedgar/companysearch.html). Firms that would like to raise capital through securities offerings on U.S. based exchanges have to file prospectuses pursuant to filing rule 424. These prospectuses lay out key information on the offering, including the amount of capital raised, the sector of the company, underwriters for the offering, and their commissions.

Working at a boutique strategy consultancy for investment banks from 2013 to 2019, I observed that there is no interactive, easy to use and free visualization of public company capital raising data despite its being publicly available. 

This project will attempt to bridge this gap in data accesibility, initially focusing on equity capital markets only (i.e firms issuing stocks)

## Functionality & MVP

   ### Aggragate Issuer Data (1.5 Day)
    * Users will be able to view the aggragate amount of equity capital raised by each issuer over a year
    * Users will be able to view the aggragate amount of commissions each issuer has paid to its bankers (also known as underwritiers)    over a year (both total commissions paid to a single a bank and aggragate commissions paid to banks)

   ### Aggragate Sector Data (1.5 Day)
    * Users will be able to view the aggragate amount of equity capital raised in each sector as these sectors are defined in the offering   prospectuses
    * Users will be able to view the aggragate amount commissions paid to bankers in each sector

   ### Aggragate investment banking revenue data (1 Day)
    * Users will be able to view investment banking revenues based on the aggragate comissions they have made over a year
    * Users will be able to view investment banking rankings ("league tables") based on the revenues

## Architecture & Technologies
    * Javascript
    * D3
    
## Wireframe

![Wireframe](https://intelligent-ib-dev.s3.us-east-2.amazonaws.com/Screen+Shot+2019-10-15+at+10.36.51+AM.png)

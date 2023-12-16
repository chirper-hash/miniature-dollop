import sys
import requests
import re
import csv
from multiprocessing.dummy import Pool
from googlesearch import search
from bs4 import BeautifulSoup
from colorama import Fore, init
from pathlib import Path
import os

# Clear screen
os.system('clear' if os.name == 'posix' else 'cls')

# Initialize colorama
init(autoreset=True)

# Color codes
red = Fore.RED
cyan = Fore.CYAN
white = Fore.WHITE
green = Fore.GREEN
magenta = Fore.MAGENTA
yellow = Fore.YELLOW

# Display PABLO logo
print(f"""
{red} ██████╗██╗  ██╗ █████╗ ███╗   ██╗████████╗ ██████╗ 
{cyan}██╔════╝██║  ██║██╔══██╗████╗  ██║╚══██╔══╝██╔═══██╗
{white}██║     ███████║███████║██╔██╗ ██║   ██║   ██║   ██║
{green}██║     ██╔══██║██╔══██║██║╚██╗██║   ██║   ██║   ██║
{magenta}╚██████╗██║  ██║██║  ██║██║ ╚████║   ██║   ╚██████╔╝
{yellow} ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ 
""")

# Disable warnings
requests.urllib3.disable_warnings()

# Get site list
try:
    file_name = input(f'{red}Site Lists: ')
    file_path = Path(__file__).with_name(file_name)
    target_sites = [site.strip() for site in file_path.open('r').readlines()]
except IndexError:
    script_name = str(sys.argv[0]).split('\\')
    exit(f'\n{red}[!] Enter <{script_name[len(script_name) - 1]}> <your list.txt>')

# Get the number of threads
pool_amount = int(input(f'{white}Threads: '))

# Create a pool of threads
thread_pool = Pool(pool_amount)

# Redirect standard output to a file
with open('result.txt', 'w') as result_file, open('result.csv', 'w', newline='') as csv_file:
    sys.stdout = result_file

    # CSV writer
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow(['Website', 'Emails'])

    # Function to extract emails
    def extract_emails(site):
        try:
            response = requests.get(site)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            email_pattern = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
            emails = set(re.findall(email_pattern, soup.get_text()))

            # Example: print the site and extracted emails
            print(f'{green}Scanning --> {site} --> Emails: {", ".join(emails)}')

            # Write to CSV
            csv_writer.writerow([site, ', '.join(emails)])

        except Exception as e:
            print(f'{red}Error extracting emails from {site}: {e}')

    # Extract emails from the given sites
    thread_pool.map(extract_emails, target_sites)

    # Close the pool of threads
    thread_pool.close()
    thread_pool.join()

    sys.stdout = sys.__stdout__  # Reset standard output

print(f'\n{yellow}[!] Results saved as "result.txt" and "result.csv".')

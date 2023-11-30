## Application Values
## Below are explanations of the various application variables

The values of these variables can be set in the application.properties as well as in the .env file.

Google OAuth Setup
- GOOGLE_CLIENT_ID: client ID used for setting up Google OAuth
- GOOGLE_CLIENT_SECRET: client secret used for setting up Google OAuth
- ADMIN_EMAILS: emails on this list are linked to accounts which are given ADMIN roles

HappyCows, values for creating a commons 
- HAPPYCOWS_COW_PRICE (default = 100): the price of a cow
- HAPPYCOWS_MILK_PRICE (default = 1): the price of a single unit of milk
- HAPPYCOWS_DEGRADATION_RATE (default = 0.001): the rate at which cows pass away due to illness, overpopulation, etc.
- HAPPYCOWS_CARRYING_CAPACITY (default = 100): the max number of cows allowed on a commons
- HAPPYCOWS_CAPACITY_PER_USER (default = 5): the max number of cows a user is allowed to purchase
- HAPPYCOWS_ABOVE_CAPACITY_HEALTH_UPDATE_STRATEGY (default = Constant): the health update strategy when the number of cows is above capacity
- HAPPYCOWS_BELOW_CAPACITY_HEALTH_UPDATE_STRATEGY (default = Linear): the health update strategy when the number of cows is below capacity
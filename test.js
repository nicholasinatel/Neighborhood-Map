// Search for Venues
curl -X GET -G \
      'https://api.foursquare.com/v2/venues/explore' \
        -d client_id="EE24NJZ4PU4LJAG2NUDL3GHV55CQJ0VHM20VIM5G1UXYLRKT" \
        -d client_secret="I4E51LOHGMUY5XKL24YVXUWDQQT55QGLHHVFJOBAFJ5OXOE1" \
        -d intent="match" \
        -d v="20180323" \
        -d ll="40.725248,-73.996143" \
        -d query="restaurant" \
        -d limit=5

// Get Venues Menus

curl -X GET -G \
      'https://api.foursquare.com/v2/venues/4b0ddac5f964a520645123e3/photos' \
        -d client_id="EE24NJZ4PU4LJAG2NUDL3GHV55CQJ0VHM20VIM5G1UXYLRKT" \
        -d client_secret="I4E51LOHGMUY5XKL24YVXUWDQQT55QGLHHVFJOBAFJ5OXOE1" \
        -d v="20180323" 
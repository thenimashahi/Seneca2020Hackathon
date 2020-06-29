const URL = 'https://data.ontario.ca/en/api/3/action/datastore_search?resource_id=455fd63b-603d-4608-8216-7d8647f43350';

fetch(URL)
    .then((res) => d3.csv(res))
    .then((data) => console.log(data));

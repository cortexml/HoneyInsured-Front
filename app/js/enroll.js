/***************************************
 * Redirect to HealthCare.gov
 ***************************************/
window.location = 'https://healthcare.gov';

/***************************************
 * Check for valid params
 * Redirect to index if zip and fip not found
 ***************************************/
REQUIRED_PARAMS = ['zip', 'fip', 'state', 'profile', 'plan'];
var urlParams = window.getJsonFromUrl();
try {
  _.map(REQUIRED_PARAMS, function(p) {
    if (!( p in urlParams)) {
      throw "Missing parameters";
    }
    ['profile'].indexOf(p) > -1 && (urlParams[p] = window.decodeJson(urlParams[p]));
  });
  // check persons
  _.map(urlParams.profile.persons, function(person) {
    if (!+person.age) {
      throw "Incorrect persons";
    }
  });

  // check plan id
  if (urlParams.plan.length != 14) {
    throw "Incorrect planId";
  }

  // double check zip, fip with those encoded in plan
  if (!(urlParams.profile.fip == urlParams.fip && urlParams.profile.zip == urlParams.zip)) {
    throw "Incorrect zip or fip";
  }
} catch(err) {
  window.location = '/index.html';
};

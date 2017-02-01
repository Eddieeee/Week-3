(function(){

  var map = L.map('map', {
    center: [39.9522, -75.1639],
    zoom: 14
  });
  var Stamen_TonerLite = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);

  /* =====================

  # Lab 2, Part 4 — (Optional, stretch goal)

  ## Introduction

    You've already seen this file organized and refactored. In this lab, you will
    try to refactor this code to be cleaner and clearer - you should use the
    utilities and functions provided by underscore.js. Eliminate loops where possible.

  ===================== */

  // Mock user input
  // Filter out according to these zip codes:
  var acceptedZipcodes = [19106, 19107, 19124, 19111, 19118];
  // Filter according to enrollment that is greater than this variable:
  var minEnrollment = 300;

  // clean data
  _.each(schools, function(school){
      if (typeof school.ZIPCODE === 'string') {
            split          = school.ZIPCODE.split(' ');
            normalized_zip = parseInt(split[0]);
            school.ZIPCODE = normalized_zip;
        }

      if (typeof school.GRADE_ORG === 'number') {  // if number
            school.HAS_KINDERGARTEN  = school.GRADE_LEVEL < 1;
            school.HAS_ELEMENTARY    = 1 < school.GRADE_LEVEL < 6;
            school.HAS_MIDDLE_SCHOOL = 5 < school.GRADE_LEVEL < 9;
            school.HAS_HIGH_SCHOOL   = 8 < school.GRADE_LEVEL < 13;
             }
      else {  // otherwise (in case of string)
            school.HAS_KINDERGARTEN  = school.GRADE_LEVEL.toUpperCase().indexOf('K') >= 0;
            school.HAS_ELEMENTARY    = school.GRADE_LEVEL.toUpperCase().indexOf('ELEM') >= 0;
            school.HAS_MIDDLE_SCHOOL = school.GRADE_LEVEL.toUpperCase().indexOf('MID') >= 0;
            school.HAS_HIGH_SCHOOL   = school.GRADE_LEVEL.toUpperCase().indexOf('HIGH') >= 0;
            }
      });


  // for (var i = 0; i < schools.length - 1; i++) {
  //   // If we have '19104 - 1234', splitting and taking the first (0th) element
  //   // as an integer should yield a zip in the format above
  //   if (typeof schools[i].ZIPCODE === 'string') {
  //     split = schools[i].ZIPCODE.split(' ');
  //     normalized_zip = parseInt(split[0]);
  //     schools[i].ZIPCODE = normalized_zip;
  //   }
  //
  //   // Check out the use of typeof here — this was not a contrived example.
  //   // Someone actually messed up the data entry
  //   if (typeof schools[i].GRADE_ORG === 'number') {  // if number
  //     schools[i].HAS_KINDERGARTEN = schools[i].GRADE_LEVEL < 1;
  //     schools[i].HAS_ELEMENTARY = 1 < schools[i].GRADE_LEVEL < 6;
  //     schools[i].HAS_MIDDLE_SCHOOL = 5 < schools[i].GRADE_LEVEL < 9;
  //     schools[i].HAS_HIGH_SCHOOL = 8 < schools[i].GRADE_LEVEL < 13;
  //   } else {  // otherwise (in case of string)
  //     schools[i].HAS_KINDERGARTEN = schools[i].GRADE_LEVEL.toUpperCase().indexOf('K') >= 0;
  //     schools[i].HAS_ELEMENTARY = schools[i].GRADE_LEVEL.toUpperCase().indexOf('ELEM') >= 0;
  //     schools[i].HAS_MIDDLE_SCHOOL = schools[i].GRADE_LEVEL.toUpperCase().indexOf('MID') >= 0;
  //     schools[i].HAS_HIGH_SCHOOL = schools[i].GRADE_LEVEL.toUpperCase().indexOf('HIGH') >= 0;
  //   }
  // }

  // filter data
  var filtered_out = [],
      filtered_data = _.filter(schools,function(school){
          isOpen    =  school.ACTIVE.toUpperCase() == 'OPEN';
          isPublic  = (school.TYPE.toUpperCase() !== 'CHARTER' ||
                       school.TYPE.toUpperCase() !== 'PRIVATE');
          isSchool  = (school.HAS_KINDERGARTEN ||
                       school.HAS_ELEMENTARY ||
                       school.HAS_MIDDLE_SCHOOL ||
                       school.HAS_HIGH_SCHOOL);
          meetsMinimumEnrollment = school.ENROLLMENT > minEnrollment;
          meetsZipCondition      = acceptedZipcodes.indexOf(school.ZIPCODE) >= 0;
          filter_condition       = (isOpen &&
                                    isSchool &&
                                    meetsMinimumEnrollment &&
                                    !meetsZipCondition);

          if (filter_condition) {
            return school;
          }
          else {
            filtered_out.push(school);
          }
      });

  // for (var i = 0; i < schools.length - 1; i++) {
  //   isOpen = schools[i].ACTIVE.toUpperCase() == 'OPEN';
  //   isPublic = (schools[i].TYPE.toUpperCase() !== 'CHARTER' ||
  //               schools[i].TYPE.toUpperCase() !== 'PRIVATE');
  //   isSchool = (schools[i].HAS_KINDERGARTEN ||
  //               schools[i].HAS_ELEMENTARY ||
  //               schools[i].HAS_MIDDLE_SCHOOL ||
  //               schools[i].HAS_HIGH_SCHOOL);
  //   meetsMinimumEnrollment = schools[i].ENROLLMENT > minEnrollment;
  //   meetsZipCondition = acceptedZipcodes.indexOf(schools[i].ZIPCODE) >= 0;
  //   filter_condition = (isOpen &&
  //                       isSchool &&
  //                       meetsMinimumEnrollment &&
  //                       !meetsZipCondition);
  //
  //   if (filter_condition) {
  //     filtered_data.push(schools[i]);
  //   } else {
  //     filtered_out.push(schools[i]);
  //   }
  // }
  console.log('Included:', filtered_data.length);
  console.log('Excluded:', filtered_out.length);

  // main loop
  var color;
  _.each(filtered_data, function(filtered_dat){
            isOpen   = filtered_dat.ACTIVE.toUpperCase() == 'OPEN';
            isPublic = (filtered_dat.TYPE.toUpperCase() !== 'CHARTER' ||
                        filtered_dat.TYPE.toUpperCase() !== 'PRIVATE');
            meetsMinimumEnrollment = filtered_dat.ENROLLMENT > minEnrollment;

            // Constructing the styling  options for our map
            if (filtered_dat.HAS_HIGH_SCHOOL){
              color = '#0000FF';
            } else if (filtered_dat.HAS_MIDDLE_SCHOOL) {
              color = '#00FF00';
            } else {
              color = '##FF0000';
            }
            // The style options
            var pathOpts = {'radius': filtered_dat.ENROLLMENT / 30,
                            'fillColor': color};
            L.circleMarker([filtered_dat.Y, filtered_dat.X], pathOpts)
              .bindPopup(filtered_dat.FACILNAME_LABEL)
              .addTo(map);

  });
  })();
//   for (var i = 0; i < filtered_data.length - 1; i++) {
//     isOpen = filtered_data[i].ACTIVE.toUpperCase() == 'OPEN';
//     isPublic = (filtered_data[i].TYPE.toUpperCase() !== 'CHARTER' ||
//                 filtered_data[i].TYPE.toUpperCase() !== 'PRIVATE');
//     meetsMinimumEnrollment = filtered_data[i].ENROLLMENT > minEnrollment;
//
//     // Constructing the styling  options for our map
//     if (filtered_data[i].HAS_HIGH_SCHOOL){
//       color = '#0000FF';
//     } else if (filtered_data[i].HAS_MIDDLE_SCHOOL) {
//       color = '#00FF00';
//     } else {
//       color = '##FF0000';
//     }
//     // The style options
//     var pathOpts = {'radius': filtered_data[i].ENROLLMENT / 30,
//                     'fillColor': color};
//     L.circleMarker([filtered_data[i].Y, filtered_data[i].X], pathOpts)
//       .bindPopup(filtered_data[i].FACILNAME_LABEL)
//       .addTo(map);
//   }
//
// })();

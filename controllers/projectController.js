
// find the qualifying projects
exports.project_list = function(query, list){

    queries = query.split(","); // split the query in its constituent parts

    let results = list;

    for(let i = 0; i < queries.length; i++) {
        results = results.filter(function (item) {
            return item.objective.toUpperCase().includes(' '+queries[i].toUpperCase().trim()+' ');
        })
    }

    return results;
}

// select (should be single) project with the same rcn
exports.project_details = function(rcn, list){
    console.log('rcn: '+rcn);
    return list.filter(function(item){
        if(item.rcn.toUpperCase().includes(rcn.toUpperCase())){
            console.log(item);
        }
        return item.rcn.toUpperCase().includes(rcn.toUpperCase());
    });
}

// get a list of contributors from one country with a reference to a project
exports.contributions_by_country= function(countryid, list){
    console.log('country: '+countryid+' in '+list.length+' projects');
    let contributions = new Array();
    list.forEach(function(project, index){
        project.organizations.forEach(function(org, index){

            if(org.country.toUpperCase() === countryid.toUpperCase()){
                console.log('name: '+org.name+' in project '+project.title);
                contributions[contributions.length] = {org: org, project: project};
                console.log('added at place '+contributions.length);
            }
        });
    });

    console.log('added '+contributions.length+' contributions, now sorting');

    return contributions.sort(function(contributionA, contributionB){
        let result = contributionA.org.name.localeCompare(contributionB.org.name);
        if(!result){
            // the it is the same organization, sort on project name
            return contributionA.project.title.localeCompare(contributionB.project.title);
        }
        return result;
    })

    console.log('returning to caller');
    // At this point a list of organizations has been created from the indicated country with a bunch of projects
    return contributions;
}


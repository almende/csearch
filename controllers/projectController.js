
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


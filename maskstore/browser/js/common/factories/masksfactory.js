app.factory('MasksFactory', function($http){
	function getMasks(category){
		var params = {
			category: category
		};
		return $http.get('/api/masks', {params: params}).then(function(res){
			console.log(res.data);
			return res.data;
		});
	}

	function getMask(id){
		console.log("making a request to get one mask! this one: ", id);
		return $http.get('/api/masks/' + id)
			.then(function(res){
				console.log(res.data);
				return res.data;
		});
	}

	return {
		getMasks: getMasks,
		getMask: getMask
	}
});

var FlickrFetcher;

FlickrFetcher = {
	installerOrder: function(packages){
		if(!packages){
			return '';
		}

		let packageGraph = new Map();
		// If one package has no dependency, its indegree index is 0.
		// If one package has one dependency, its indegree index is 1.
		let indegrees = new Map();
		let queue = [];
		let count = 0, installOrder = '';

		// Build the graph.
		packages.forEach(pair => {
			let pairArr = pair.split(': ');
			let dependency = pairArr[1];
			let package = pairArr[0];

			// If one package has one dependency, its indegree index is 1.
			if(dependency === ''){
				indegrees.set(package, 0);
			}
			else{ // Map the dependency package to the packages which requires the dependency package.
				if(!packageGraph.has(dependency)){
					packageGraph.set(dependency, []);
				}
				packageGraph.get(dependency).push(package);

				if(!indegrees.has(package)){
					indegrees.set(package, 1);
				}
				else{
					indegrees.set(package, indegrees.get(package) + 1);
				}
			}

		});

		// Put the package with indegree index 0 to the queue
		for(let [package, indegree] of indegrees){
			if(indegree === 0){
				queue.push(package);
				count++;
				installOrder += package + ', ';
			}
		}

		// For the package in the queue, if there is package which requires it,
		// decrement the indegree of the requring package. If the requiring package
		// has indegree index 0, put it to the queue. Recurisively go through the
		// package in the queue, until the queue is empty. 
		// During the interation process, count the package which has indegree 0;

		while(queue.length > 0){
			let size = queue.length;
			while(size > 0){
				let installed = queue.shift();
				if(packageGraph.has(installed)){
					packageGraph.get(installed).forEach( toInstall => {
						indegrees.set(toInstall, indegrees.get(toInstall)  - 1);
						if(indegrees.get(toInstall) === 0){
							count++;
							queue.push(toInstall);
							installOrder += toInstall + ', ';
						}
					} );
				}
				size--;
			}
		}

		// If all of the packages have been iterated, there is no cycles.
		try{
			if(count === indegrees.size){ // No cycle
				return installOrder.substring(0, installOrder.length - 2);
			}
			else{
//				throw 'Dependencies specificatoin contains cycle.';
				throw new TypeError('Dependencies specificatoin contains cycle.');
			}
		}
		catch(e){
			console.log('Dependencies specificatoin contains cycle.');
		}

	}
};

module.exports = FlickrFetcher;

if(document.title == "TGIF Home"){

	let read = document.getElementById("read")            
	read.addEventListener('click', (e) =>{                                          
	if (read.innerText == "Read More"){              
		read.innerText = "Read Less"
	} else if (read.innerText == "Read Less"){
		read.innerText = "Read More"
	}
	})

}else{

	const senate = document.getElementById("senate")
	const house = document.getElementById("house")

	if (senate) {
	whatPage("senate")
	} else {
	whatPage("house")
	}

	function whatPage(url) {
	
		let log = {
			headers:{
				"X-API-Key": "womLlhrO7lab6UL8kMWNVIcOXlPjRspqio8spGyU"
			}
		}

		fetch('https://api.propublica.org/congress/v1/113/' + url +'/members.json', log)
			.then(res => res.json())
			.then(json =>{
				var members = [...json.results[0].members]
				myProgram(members)
			})
			.catch(err => console.error(err.message))
		
	}

	function myProgram(members){

		var membersTable = members

		if(document.title == "TGIF Congress 113-House" || document.title == "TGIF Congress 113-Senate" ){
			let table = document.getElementById('tablaBodyHouse')?document.getElementById
			('tablaBodyHouse'):document.getElementById('tablaBodySenate')


			var statesChosen = "All"
			var membersToShow = []
			let filterState = []
			let selectParty =["R", "D", "ID"]

			function totalFilter(){
				if (statesChosen == "All"){
					membersToShow = membersTable
				} else {
					membersToShow = membersTable.filter(member =>member.state == statesChosen)
				}

				membersToShow =membersToShow.filter(member => selectParty.includes(member.party))
			}

			function addColumn() {
				table.innerHTML = ""
				totalFilter()
				membersToShow.forEach(member => {
					let row = document.createElement('tr')	
					let tdName = document.createElement('td')			 
					let tdParty = document.createElement('td')			 
					let tdState = document.createElement('td')		
					let tdYearsOffice = document.createElement('td')  	
					let tdVotesParty = document.createElement('td')
					let tdNameA = document.createElement('a')  
					tdNameA.href = member.url
					tdNameA.target = "_blank"
					tdNameA.innerText = member.last_name + " " +  member.first_name + " " + ( member.middle_name || "") 
					tdParty.innerText = member.party																		 
					tdState.innerText = member.state																
					tdYearsOffice.innerText = member.seniority														  	
					tdVotesParty.innerText = member.votes_with_party_pct.toFixed(2) + " %"										
					table.appendChild(row)
					row.appendChild(tdName)										   
					row.appendChild(tdParty)				  
					row.appendChild(tdState)				 
					row.appendChild(tdYearsOffice)          
					row.appendChild(tdVotesParty)
					tdName.appendChild(tdNameA)          
			})	
			}			
			addColumn()	

			membersTable.forEach(member => {
				filterState.push(member.state)
			})
										
			let cleanUpFilterState = filterState.filter((state, index) => filterState.indexOf(state) === index)
			filterState = cleanUpFilterState.sort()
			let selectState = document.getElementById('houseSelectStates')?document.getElementById('houseSelectStates'):document.getElementById('senateSelectStates')

			function addColumnButton(filterS){
				columnButtonState = document.createElement('option')
				columnButtonState.innerText = filterS
				columnButtonState.value = filterS
				selectState.appendChild(columnButtonState)	 
			}
			filterState.forEach(fil =>{
				addColumnButton(fil)		

			})

			selectState.addEventListener("change", (e) => {
				let stateChosen = e.target.value
				statesChosen = stateChosen
				addColumn()
			})

			let inputParty = document.getElementsByName("party")
			inputParty = Array.from(inputParty)
			inputParty.forEach(input =>{
				input.addEventListener('change', (e) =>{
					let selectedMatch = e.target.value
					let selectedCheckMatch = e.target.checked
					if (selectParty.includes(selectedMatch) && !selectedCheckMatch){
						selectParty = selectParty.filter(party => party !== selectedMatch)
					} else if (!selectParty.includes(selectedMatch) && selectedCheckMatch){
						selectParty.push(selectedMatch)
					} 
					addColumn()
				})
			})
		}else if(document.title == "TGIF Attendance-House" || document.title == "TGIF Attendance-Senate" || document.title == "TGIF Party Loyalty-House" || document.title == "TGIF Party Loyalty-Senate"){
			
			const statistics = {
				totalRepublicans: 0,
				totalDemocrats: 0,
				totalIndependent: 0,		
				totalMatches: 0,
				averageDemocraticVotes: 0,
				averageRepublicans: 0,
				averageIndependent: 0,
				lessVotesLost: [], // Least Engaged (Bottom 10% Attendance)
				moreVotesLost: [], // Most Engaged (Top 10% Attendance)
				lessCommitted: [], // Least Loyal (Bottom 10% Party)
				moreCommitted: [], // Most Loyal (Top 10% of Party)
							
			}
			
			let averageDemocratics = []
			let averageRepublicans = []
			let newTables = []
	
			membersTable.forEach(member =>{							
				newTables.push(member)	   // Creo una nueva tabla --- Sumo la cantidad de miembros en los partidos --- pusheo dos arrays para sacar el porcentaje
				if (member.party == "R"){	
					statistics.totalRepublicans++	
					averageRepublicans.push(member.votes_with_party_pct) 
				}else if(member.party == "D"){
					statistics.totalDemocrats++
					averageDemocratics.push(member.votes_with_party_pct)	
				}else if(member.party == "ID"){
					statistics.totalIndependent++
				}
				
				statistics.totalMatches = statistics.totalRepublicans + statistics.totalDemocrats + statistics.totalIndependent 
			})

			

			newTables = newTables.filter(members => members.total_votes > 0 ) // Elimino aquellos miembros sin votos
			statistics.averageDemocraticVotes = (averageDemocratics.reduce((a , b) => a + b) / averageDemocratics.length).toFixed(2)	// Porcentaje de
			statistics.averageRepublicans = (averageRepublicans.reduce((a , b) => a + b) / averageRepublicans.length).toFixed(2)		//	votos R/D

			let orderedPercentage = Math.ceil(newTables.length *10 /100) 
			let lostVotesSorted = newTables.sort((a, b) => b.missed_votes_pct - a.missed_votes_pct)
			statistics.lessVotesLost = lostVotesSorted.slice(0, orderedPercentage) // Least Engaged (Bottom 10% Attendance)
			let moreVotesSorted  = newTables.sort((a, b) => a.missed_votes_pct - b.missed_votes_pct)
			statistics.moreVotesLost = moreVotesSorted.slice(0, orderedPercentage) // Most Engaged (Top 10% Attendance)
			let moreLoyalSorted = newTables.sort((a, b ) => b.votes_with_party_pct - a.votes_with_party_pct)
			statistics.moreCommitted = moreLoyalSorted.slice(0, orderedPercentage) // Most Loyal (Top 10% of Party)
			let lestLoyalSorted = newTables.sort((a, b ) => a.votes_with_party_pct - b.votes_with_party_pct)
			statistics.lessCommitted = moreLoyalSorted.slice(0, orderedPercentage) // Least Loyal (Bottom 10% Party)
			
			let tableAttendanceTop = document.getElementById("tableAttendance")?document.getElementById("tableAttendance"): document.getElementById("tableLoyalty") 

			function tableTop(){
				tableAttendanceTop.innerHTML= ` 
				<tr>
					<td>Democrats</td>
					<td>${statistics.totalDemocrats}</td>
					<td>${statistics.averageDemocraticVotes}%</td>
				</tr>
				<tr>
					<td>Republicans</td>
					<td>${statistics.totalRepublicans}</td>
					<td>${statistics.averageRepublicans}%</td>
				</tr>
				<tr>
					<td>Independents</td>
					<td>${statistics.totalIndependent || "-"}</td>
					<td>${statistics.averageIndependent || "-"}	
				</tr>
				<tr>
					<td>Total</td>
					<td>${statistics.totalMatches}</td>	
					<td>-</td>
				</tr>		
				`
			}
			tableTop(statistics)

			function bottomTables(id, array){
			
				let lowerTable = document.getElementById(id)
				array.forEach(member =>{
					lowerTable.innerHTML += `
					<tr>
						<td>${member.last_name}, ${member.first_name} ${member.middle_name || ""}</td>
						<td>${member.missed_votes}</td>
						<td>${member.missed_votes_pct}%</td>
					</tr>
					`
				})
			}

			if(document.title == "TGIF Attendance-House" || document.title == "TGIF Attendance-Senate"){
				bottomTables("leastEngaged", statistics.lessVotesLost)
				bottomTables("mostEngaged", statistics.moreVotesLost)
			}else if (document.title == "TGIF Party Loyalty-House" || document.title == "TGIF Party Loyalty-Senate"){
				bottomTables("leastLoyal", statistics.lessCommitted)
				bottomTables("mostLoyal", statistics.moreCommitted)
			}	
		}
	}
}
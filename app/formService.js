app.service('FormService' , function(){
	
	return {
		Candidature :{
			DateStart: moment().format(),
			DateEnd: null,
			Position : {
				latitude : 0,
				longitude: 0
			},
			Language : ""
		},
		Candidat :{
			Name : '',
			LastName : '',
			Address : {},
			Phone : '',
			Email : '',
			Situation : '',
			Files : []
		},
		Profession : "",
		Project : {
			Description : "",
			Attractions : "",
			Locations : "",
			Population :"",
			Local : "true",
			LocalParams : {
				Surface : null,
				Floor: null,
				Terrace : 'true',
				CurrentActivity : null
			},
			LocalPosition : { latitude: 43, longitude: 2 },
			LocalDescription : ""
		},
		Founding : {
			PersonalApport : "",
			Description : "",
			Bank : "",
			Rib :[]
		},
		Other : "",
		References :[
		]

	}
});
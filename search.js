var searchBtn = document.querySelector("#search-btn");
var songDetails = document.getElementById("song-details");
searchBtn.addEventListener("click", function(e){
	e.preventDefault();
	var searchTerm = document.querySelector("#search-box").value;
	searchTunes(searchTerm);
	console.log(searchTerm);
})

function searchTunes(song) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	var res = JSON.parse(this.responseText);
    	var count = res.resultCount;
      sessionStorage.setItem("searchRes", this.responseText);
    	var songHTML = "";

     //document.getElementById("demo").innerHTML = this.responseText;
     

     for(var i=0; i<count; i++){
     	songHTML += "<div class='card-container' id='"+res.results[i].trackId+"'>";
     	songHTML += "<p>"+res.results[i].trackName+"</p>";
     	songHTML += "<p>"+res.results[i].artistName+"</p>";
     	songHTML += "<p>"+res.results[i].collectionName+"</p>";
     	songHTML += "<p>"+millisToMinutesAndSeconds(res.results[i].trackTimeMillis)+"</p>";
     	songHTML += "<button class='btn-details' id='"+res.results[i].trackId+"'> Show More </button>"
     	//songHTML += "<label class='fav-container'>";
      songHTML += "<div>";
      songHTML += "<span><p style='display:inline-block;'>Add to favourites</p>";
  		songHTML += "<input type='checkbox' name='"+res.results[i].trackId+"' id='"+res.results[i].trackId+"' onchange='handleChange(this);'>";
  		//songHTML += "<span class='checkmark'></span>";
		  //songHTML += "</label>";
      songHTML += "</span>";
      songHTML += "</div>";
     	songHTML += "</div>";
     }
     songDetails.innerHTML = songHTML;
    }
  };
  xhttp.open("GET", "https://itunes.apple.com/search?term="+song+"&media=music&entity=song", true);
  xhttp.send();
}
var favList = [];
//localStorage.setItem('favData', JSON.stringify(favList));

function handleChange(e) {
  var favSong = {};
  if(e.checked == true){
    addFav(e.id);
    // favSong.id = e.id;
    //favList.push(favSong);
    //console.log(favList);
    //localStorage.setItem()
        console.log("checked");
    }else{
        // var newList = favList.filter(function(fav){
        //   console.log(fav.id);
        //   return fav.id !== e.id;
        // })
        removeFav(e.id);
        console.log("removed");
   }
}

function getFav() {
  if(localStorage.getItem('favData')){
   return JSON.parse(localStorage.getItem('favData'));
  }
  else{
    return null;
  }
}

function removeFav(item) {
   var fav = getFav();
   fav.map(function(d,i){
    if(d.id == item){
      fav.splice(i, 1);
       localStorage.setItem('favData', JSON.stringify(fav));
    }
   })
}

function addFav(item) {
  var songData = {};
  var fav = getFav();
  if(fav !=null){
   getFavAjax(item, function(data){
    //console.log(data.results[0]);
    songData = {
      id : data.results[0].trackId,
      name : data.results[0].trackName,
      artist : data.results[0].artistName,
      album : data.results[0].collectionName,
      time : data.results[0].trackTimeMillis
    };

    fav.push(songData);
    localStorage.setItem('favData', JSON.stringify(fav));

    }) 
  }
  else{

    getFavAjax(item, function(data){
    //console.log(data.results[0]);
    songData = {
      id : data.results[0].trackId,
      name : data.results[0].trackName,
      artist : data.results[0].artistName,
      album : data.results[0].collectionName,
      time : data.results[0].trackTimeMillis
    };
    var n = [];
    //localStorage.setItem('favData', JSON.stringify(favList));
    n.push(songData);
    localStorage.setItem('favData', JSON.stringify(n));

    })

  }
  
  
}

document.addEventListener('click',function(e){
    if(e.target && e.target.classList.contains("btn-details")){//do something
    	//console.log(e.target.id);
    	songSelected(e.target.id);
    }
 })

function getFavAjax(id,callback){
  //console.log(id);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var res = JSON.parse(this.responseText);
      callback(res);
    }
  };
  xhttp.open("GET", "https://itunes.apple.com/lookup?id="+id, true);
  xhttp.send();
}

function songSelected(id){
	//console.log(id);
	var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	var res = JSON.parse(this.responseText);
    	//console.log(res);
    	localStorage.setItem('songInfo', JSON.stringify(res));
    	window.location ="single-song.html?trackName="+res.results[0].trackName;

     //trackName,artistName,collectionName,releaseDate,artworkUrl100,collectionPrice,trackTimeMillis
     document.getElementById("demo").innerHTML = this.responseText;
     

     
    }
  };
  xhttp.open("GET", "https://itunes.apple.com/lookup?id="+id, true);
  xhttp.send();
}


function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

window.onload = function (e) {
  //console.log("back");
    var res = sessionStorage.getItem('searchRes');         
    success(res);
}

function success(response) {
    var res = JSON.parse(response);
    var count = res.resultCount;
    var songHTML = "";
    var songDetails = document.getElementById("song-details");
    for(var i=0; i<count; i++){
      songHTML += "<div class='card-container' id='"+res.results[i].trackId+"'>";
      songHTML += "<p>"+res.results[i].trackName+"</p>";
      songHTML += "<p>"+res.results[i].artistName+"</p>";
      songHTML += "<p>"+res.results[i].collectionName+"</p>";
      songHTML += "<p>"+millisToMinutesAndSeconds(res.results[i].trackTimeMillis)+"</p>";
      songHTML += "<button class='btn-details' id='"+res.results[i].trackId+"'> Show More </button>"
      //songHTML += "<label class='fav-container'>";
      songHTML += "<div>";
      songHTML += "<span><p style='display:inline-block;'>Add to favourites</p>";
      songHTML += "<input type='checkbox' name='"+res.results[i].trackId+"' id='"+res.results[i].trackId+"' onchange='handleChange(this);'>";
      //songHTML += "<span class='checkmark'></span>";
      //songHTML += "</label>";
      songHTML += "</span>";
      songHTML += "</div>";
      songHTML += "</div>";
     }
     songDetails.innerHTML = songHTML;
}
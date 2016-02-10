"use strict"

let ref = new Firebase('https://orbareket.firebaseio.com/');

ref.child("shows").once("value", function (snapshot) {
  snapshot.forEach((childSnapshot) => {
    let show = childSnapshot.val()
    displayShow(show.title, show.starttime, show.endtime, show.venue, show.artists, show.link)
  })

  $('.slideshow').slick({
    dots: false,
    infinite: true,
    speed: 300,
    arrows: true,
    appendArrows: $('.slideshow-arrows'),
    prevArrow: '<button><i class="fa fa-arrow-left"></i></button>',
    nextArrow: '<button><i class="fa fa-arrow-right"></i></button>',
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 550,
        settings: {
          arrows: false,
          dots: false,
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  })

})


function displayShow(title, starttime, endtime, venue, artists, link) {
  console.log('meow')
  let starttimeObj = new Date(starttime * 1000);
  let starttimeFormatted = ''

  let month = starttimeObj.getMonth(); //months from 1-12
  let monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  month = monthShortNames[month];
  let day = starttimeObj.getDate();
  starttimeFormatted = month + ' ' + day;
  let hours = starttimeObj.getHours() + 3
  let minutes = starttimeObj.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;

  let $date = $('<h2>').text(starttimeFormatted).addClass('showDate');
  let $venue = $('<h3>').text(venue).addClass('showVenue');
  let $title = $('<p>').text(title).addClass('showTitle');
  let $time = $('<p>').text(strTime).addClass('showTime');
  let $artists = artists.map((artist, i) => {
    return $('<p>').html(artist.artist + ' on ' + artist.instrument).addClass('showArtists')
  })
  let $link = $('<button>').text('RSVP').attr('href.child("shows")', link).addClass('default1');

  let $showInfo = $('<div>').addClass('showInfo')
  .append(
    $date,
    $venue,
    $title,
    $time,
    '<br>',
    $artists
  )
  if (link) {
    $showInfo = $showInfo.append($link);
  };
  let $slide = $('<div>').append($showInfo);

  $('.slideshow').append($slide);
}

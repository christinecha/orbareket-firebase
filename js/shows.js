"use strict"

let ref = new Firebase('https://orbareket.firebaseio.com/')

const toUnix = (datetime) => {
  datetime = new Date(datetime)
  return Math.round(datetime.getTime() / 1000);
}

let currentDate = new Date()
currentDate = toUnix(currentDate)

ref.child("shows").orderByChild('starttime').startAt(currentDate).once("value", function (snapshot) {
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
        breakpoint: 900,
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

function formatDateTime(datetime) {
  let datetimeObj = new Date(datetime * 1000 + 1);
  let dateFormatted

  let month = datetimeObj.getMonth(); //months from 1-12
  let monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  month = monthShortNames[month];
  let day = datetimeObj.getDate();
  dateFormatted = month + ' ' + day;
  let hours = datetimeObj.getHours() + 5
  let minutes = datetimeObj.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  let strTime = hours + ':' + minutes + ' ' + ampm;

  return [dateFormatted, strTime]
}


function displayShow(title, starttime, endtime, venue, artists, link) {
  let $title = $('<p>').text(title).addClass('showTitle');
  let $venue = $('<h3>').text(venue).addClass('showVenue');
  let $date = venue.toUpperCase().match("TOUR") ? $('<h2>').text(formatDateTime(starttime)[0] + ' - ' + formatDateTime(endtime)[0]).addClass('showDate') : $('<h2>').text(formatDateTime(starttime)[0]).addClass('showDate');
  let $time = venue.toUpperCase().match("TOUR") ? '<br>' : $('<p>').text(formatDateTime(starttime)[1]).addClass('showTime');
  let $artists = artists.map((artist, i) => {
    return $('<p>').html('<b>' + artist.artist + '</b> : ' + artist.instrument).addClass('showArtists')
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
  console.log($showInfo.height())
    $showInfo.css('padding', ((250 - $showInfo.height) / 2) + 'px')

  $('.slideshow').append($slide);
}

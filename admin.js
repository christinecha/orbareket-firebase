"use strict"

let ref = new Firebase('https://orbareket.firebaseio.com/')

const toUnix = (datetime) => {
  datetime = new Date(datetime)
  return Math.round(datetime.getTime() / 1000);
}

const toLocal = (unix) => {
  let localDate = new Date(unix * 1000)
  let localDateArray = localDate.toISOString().split('')
  localDate = localDateArray.splice(0, localDateArray.length - 8).join('')
  return localDate
}

$('.add-new-show').on('click', (e) => {
  e.preventDefault()
  console.log('hi')
  ref.child('shows').push({
    title: '',
    starttime: 1456266600,
    endtime: 1456266600,
    venue: '',
    artists: [{ artist: 'Or Bareket', instrument: 'bass' }]
  })
})

$('.shows').on('submit', '.update-show', (e) => {
  e.preventDefault()

  let show_id = $(e.target).attr('data-key')
  let show_title = $(e.target).children('.new-show__title').first().val()
  let show_starttime = toUnix($(e.target).children('.new-show__starttime').first().val())
  let show_endtime = toUnix($(e.target).children('.new-show__endtime').first().val())
  let show_venue = $(e.target).children('.new-show__venue').first().val()
  let artists = []

  $(e.target).find('.new-show__artist-group').each((i, elem) => {
    let artist = $(elem).children('.new-show__artist').val()
    let instrument = $(elem).children('.new-show__instrument').val()
    artists.push({
      artist: artist,
      instrument: instrument
    })
  })

  ref.child('shows').child(show_id).update({
    title: show_title,
    starttime: show_starttime,
    endtime: show_endtime,
    venue: show_venue,
    artists: artists
  })
})

$('.new-show__starttime').on('keyup', (e) => {
  let starttime = $(e.target).val()
  console.log(starttime)
  $('.new-show__endtime').val(starttime)
})

$('.shows').on('click', '.add-artist-group', (e) => {
  $(e.target).parent().children('.new-show__artists').first().append($('.new-show__artist-group').first().clone())
})

let currentDate = new Date()
currentDate = toUnix(currentDate)

ref.child('shows').orderByChild('starttime').startAt(currentDate).on('child_added', (snapshot) => {
  let show = snapshot.val()

  let $show_title = $('<input>')
    .addClass('new-show__title')
    .val(show.title)
    .attr('type', 'text')

  let $show_starttime = $('<input>')
    .addClass('new-show__starttime')
    .val(toLocal(show.starttime))
    .attr('type', 'datetime-local')

  let $show_endtime = $('<input>')
    .addClass('new-show__endtime')
    .val(toLocal(show.endtime))
    .attr('type', 'datetime-local')

  let $show_venue = $('<input>')
    .addClass('new-show__venue')
    .val(show.venue)
    .attr('type', 'text')

  let $show_artists = $('<div>').addClass('new-show__artists')

  if (show.artists) {
    $show_artists.append(
      show.artists.map((data, i) => {
        let $group = $('<div>')
          .addClass('new-show__artist-group')
        let $artist = $('<input>')
          .addClass('new-show__artist')
          .val(data.artist)
          .attr('type', 'text')
        let $instrument = $('<input>')
          .addClass('new-show__instrument')
          .val(data.instrument)
          .attr('type', 'text')
        $group.append($artist, $instrument)
        return $group
      })
    )
  }

  let $show = $('<form>')
    .addClass('update-show')
    .attr('data-key', snapshot.key())
    .append(
      $show_title,
      $show_starttime,
      $show_endtime,
      $show_venue,
      $show_artists,
      '<div class="add-artist-group">+ add another</div>',
      '<br><button>UPDATE SHOW</button>'
    )

  $('.shows').append($show)
})

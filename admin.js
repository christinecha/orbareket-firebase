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

const displayNotice = (msg) => {
  $('.notice').fadeIn(200)
  $('.notice').html(msg)
  let fadeOut = setTimeout(() => {
    $('.notice').fadeOut(500)
  }, 2000)
}

$('.add-new-show').on('click', (e) => {
  e.preventDefault()
  console.log('hi')
  ref.child('shows').push({
    title: null,
    starttime: toUnix(Date.now()),
    endtime: toUnix(Date.now()),
    venue: null,
    artists: [{ artist: 'Or Bareket', instrument: 'bass' }]
  }, displayNotice('new show added'))
})

$('.shows').on('submit', '.update-show', (e) => {
  e.preventDefault()

  let show_id = $(e.target).attr('data-key')
  console.log(show_id)
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
  }, displayNotice('show updated'))
})

$('.shows').on('click', '.delete-show', (e) => {
  e.preventDefault()

  let show_id = $(e.target).parent().attr('data-key')
  ref.child('shows').child(show_id).remove(displayNotice('show removed'))

})

$('.shows').on('keyup', '.new-show__starttime', (e) => {
  let starttime = $(e.target).val()
  let endtime = $(e.target).siblings('.new-show__endtime').first().val()
  if (starttime > endtime) {
    $(e.target).siblings('.new-show__endtime').first().val(starttime)
  }
})

$('.shows').on('click', '.add-artist-group', (e) => {
  let $group = $('<div>')
    .addClass('new-show__artist-group')
  let $artist = $('<input>')
    .addClass('new-show__artist')
    .attr('placeholder', 'artist')
    .attr('type', 'text')
  let $instrument = $('<input>')
    .addClass('new-show__instrument')
    .attr('placeholder', 'instrument')
    .attr('type', 'text')
  $group.append(
    $artist,
    ' on &nbsp;',
    $instrument
  )
  $(e.target).parent().children('.new-show__artists').first().append($group)
})

let currentDate = new Date()
currentDate = toUnix(currentDate)

ref.child('shows').orderByChild('starttime').startAt(currentDate).on('value', (snapshot) => {
  $('.shows').empty()

  snapshot.forEach((childSnapshot) => {
    let show = childSnapshot.val()
    console.log(show)

    let $show_title = $('<input>')
      .addClass('new-show__title')
      .val(show.title)
      .attr('placeholder', 'show title')
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
      .attr('placeholder', 'venue')
      .attr('type', 'text')

    let $show_artists = $('<div>')
      .addClass('new-show__artists')
      .append('<h5>featuring</h5>')

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
          $group.append(
            $artist,
            ' on &nbsp;',
            $instrument
          )
          return $group
        })
      )
    }

    let $show = $('<form>')
      .addClass('update-show')
      .attr('data-key', childSnapshot.key())
      .append(
        $show_title,
        $show_starttime,
        $show_endtime,
        $show_venue,
        $show_artists,
        '<div class="add-artist-group">+ add another artist</div>',
        '<br><button>UPDATE SHOW</button>',
        '<button class="delete-show">DELETE SHOW</button>'
      )

    $('.shows').append($show)
  })

})

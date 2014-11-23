@app
  .service 'DataService', () ->

    cards =

    @getCard = (id) ->
      return cards[id]

    return @
'use strict'

const maps = {
  classic: ['xgenhq', 'sunnyvaletrailerpark', 'toxicspillway', 'workplaceanxiety', 'storageyard', 'greenlabyrinth', 'floorthirteen', 'thepit', 'industrialdrainage', 'globalmegacorpltd', 'concretejungle', 'nuclearunderground', 'unstableterrace', 'officespace', 'thefoundation', 'brawlersburrow', 'trenchrun', 'corporatewasteland', 'sewagetreatment', 'stormdrain'],
  ballistick: ['stickfederationhq', 'transgalacticcomstation', 'spaceelevatorcontrol', 'automateddiscoverypod', 'thesfvengeance', 'geminicontrolstation', 'outpost', 'spacemountain', 'barge', 'cliffside', 'orbit'],
  feature: ['alientestlab', 'officepod', 'underspace', 'outerspace', 'islandsofanarchy', 'parisstreets', 'deadspace', 'battlegroundbase', 'spacebridge', 'elitebase', 'trenchspace', 'dday', 'subterraneansector', 'shipdock', 'cliffs', 'radiation', 'leetspace', 'voiders', 'universityofstick', 'shelter', 'outerspacedestruct', 'cubicles', 'oceans', 'sewertunnel', 'futureoffice', 'lastmap']
}

const { appendFile, existsSync, mkdirSync } = require('fs')
const { get } = require('http')

function downloadMaps(type) {
  const typeDir = type === 'classic' ? '' : type
  const url = `http://www.xgenstudios.com/stickarenaclassic/maps/563/${typeDir}`
  const mapArr = maps[type]
  const dir = `./maps/558/${typeDir}` // 563 to 558, for BallistickEMU

  // Create base folder when needed
  if (!existsSync('./maps/')) mkdirSync('./maps/')

  // Create map folder when needed
  if (!existsSync(dir)) mkdirSync(dir)

  for (let i = 0; i < mapArr.length; i++) {
    const map = `__${mapArr[i]}.dat`

    get(`${url}/${map}`, (res) => {
      let data = ''

      res.on('data', (chunk) => data += chunk).on('end', () => {
        appendFile(`${dir}/${map}`, data, (err) => { if (err) throw err })
      })
    })
  }
}

downloadMaps('classic')
downloadMaps('ballistick')
downloadMaps('feature')

# Something roguelike

Under construction

## Code organization

### Modules
* Common (core or lang) utils
* Test utils
* Game Engine
* ui-components

## Physics

### Space
  * Discrete
  * flat
  * sqrt(2) = 1.5 (will be 1.4)

### Time
  * Discrete =)

## Nature
There is a trees

## Known issues
  * Path smoothing somethimes dosen't work with border-crossing paths.

## DEV ENV TODO
  * Run single test
  * Improve assertion error messages
  * Debug test from IDE

## Roadmap

  ### v 0.0.#
    * Collision handling (one person per tile) (in progress, partial done)
    * Take into account actors movement direction in collsion handling ?
    * Simple ascii view with collided actors (in progress, partial done)
    * Write more test scenarious for collision handling (swap, multiple actors in collsion group, tunnels) (in progress, partial done)
    * Test collsion multiple actors in tunnel
    * Test collision behavior near bounds
    * Write test for PF: path post processing should not change path cost
    * Somehow deal with browser scaling
    * Standardize size and coordinates converting from cells (tiles) to pixels and relative to absolute
    * Displaying services refacatoring
    * Sandbox (ui, user interaction improvements, refactor)
    * Place stock area
    * Woodcutting mechanics impovement (take a wood and bring to storage)
    * Place house
    * Display resource count and population
    * Assign jobs (for start idle and cut trees)
    * Game run ( not sandbox as now )
    * Game saving (in local storage)

  ### v 0.1.0 (MVP)

  * Resources: wood and food
  * Building: house, barn, stock (area)

  Trees is not renewable and static. Food somehow respawn (near trees?)

  Two jobs: Geatherer and woodcutter

  Geatheres geather food to barn

  Population eat food

  House contains max 5 people
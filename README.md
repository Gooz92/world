# Something roguelike

Under construction

## Code organization

### Modules
* Common (core or lang) utils (without dom utils)
* Test utils (assetion functions)
* Game Engine (World, Action, strategy, collision handling)
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

## Collision handling
 * Detect collsion
    Collsion occurs if two walkers on next tick try to occupy same tile or move trought each other

## Roadmap

  ### v 0.0.#
    * Resource gethering zones
    * Woodcutting mechanics impovement (in progress)
    * Write tests for tree cutting (in progrees)
    * Fix wood drop on stock tile (wood amoun on tile can be > LIMIT in some cases)
    * Implement tiles grid class
    * Place area tool (partialy done)
    * Place stock area (partialy done)
    * AStar (partial done)
    * Validate placement area + size (partial done)
    * Place buildings (there is posiblity to place barn)
      - Rotate building (in progress)
    * Food regeneration under trees (partial done. food generated on world creation)
    * Actors inventory (Person inventory is done)
    * Food gethering strategy
    * Cancel area definition by esc or right click
    * Enum creation mechanism review (?)
    * Validate building placement
    * Multitile rendering
    * Show area size 
    * Selection in sandbox (partial done, in progress)
    * Sandbox (ui, user interaction improvements, refactor) (in progress)
    * Displaying services refacatoring
    * Collision handling (one person per tile) (partial done)
    * Take into account actors movement direction in collsion handling ?
    * Simple ascii view with collided actors (in progress, partial done)
    * Write more test scenarious for collision handling (swap, multiple actors in collsion group, tunnels) (in progress, partial done)
    * Test collsion multiple actors in tunnel
    * Test collision behavior near bounds
    * Write test for PF: path post processing should not change path cost
    * Somehow deal with browser scaling
    * Standardize size and coordinates converting from cells (tiles) to pixels and relative to absolute
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
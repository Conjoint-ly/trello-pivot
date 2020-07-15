# Pivot Table Power-Up for Trello (by Conjoint.ly)

This power-up adds pivot table functionality to Trello. It was developed by the [Conjoint.ly](https://conjointly.com/?utm_campaign=trello-pivot-table&utm_medium=social&utm_source=github) development team as a quick way to count to-do and completed cards, as well as tally total hours budgeted for cards. It is particularly useful if you use Trello for:

* Planning development hours,
* Tracking costs for projects,
* Whatever other reason and need breakdowns by custom fields.

![Pivot Table demo](src/html/pivot-table-demo.gif)

## Benefits

* 💨 Fast
* 🆓 Free (needs no registrations)
* 😋 Easy to use & intuitive

## How it works (technically speaking)

We make use of the existing [pivottable](https://github.com/Conjoint-ly/pivottable) library, into which, via `localStorage`, we load the following card data from the active board:

* Card ID
* Card Name
* List
* Members (concatenated with commas)
* Labels (concatenated with commas)
* Each individual custom field

## Bugs, feedback, and feature requests

This project is open source, and contributions are welcome. You can use [GitHub issues](https://github.com/Conjoint-ly/trello-pivot/issues) to report issues or request features.

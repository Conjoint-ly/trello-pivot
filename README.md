# Pivot Table Power-Up for Trello (by Conjoint.ly)

This power-up add a pivot table functionality to Trello. It was developed by the [Conjoint.ly](https://conjointly.com/) development team as a quick way to count to-do and completed cards, as well as tally total hours budgeted for cards. It is particularly useful if you use Trello for planning development hours or tracking costs for projects.

## How it works (technically speaking)

We make use of the existing [pivottable](https://github.com/Conjoint-ly/pivottable) library, into which we load card data from the active board via `localStorage`. The fields contain:

* Card ID
* Card Name
* List
* Members (concatenated with commas)
* Labels (concatenated with commas)
* Each individual custom field

## Bugs, feedback, and feature requests

This project is open source, and contributions are welcome. You can use [GitHub issues](https://github.com/Conjoint-ly/trello-pivot/issues) to report issues or request features.

# Udacity-Neighborhood-Map-Project

Visit my Portfolio at: [nicklobo](http://nicklobo.com.br/)

# What it is
Single page application featuring a map of a neighborhood that I would like to visit. With functionalities of  highlighted locations, third-party data about those locations and various ways to browse the content.

Technologies used:
- [Knockout](https://knockoutjs.com/) - Simplify dynamic Javascript UIs with the Model-View-View Model pattern.
- [Foursquare API](https://developer.foursquare.com/) - Power location-based experiences in your app or website.
- [Google Maps API](https://developers.google.com/maps/documentation/) -Build customized, agile experiences that bring the real world to your users with static and dynamic maps, Street View imagery, and 360° views.
- [Bootstrap4](https://getbootstrap.com/) - Build responsive, mobile-first projects on the web with the world’s most popular front-end component library. 
- [jQuery](https://jquery.com/) - Fast, small, and feature-rich JavaScript library.


## Table of Contents
- [What it is](https://github.com/nicholasinatel/Neighborhood-Map/#what-it-is)
- [Dependencies](https://github.com/nicholasinatel/Neighborhood-Map/#dependencies)
- [Project](https://github.com/nicholasinatel/Neighborhood-Map/#project)
- [License](https://github.com/nicholasinatel/Neighborhood-Map/#license)

## Dependencies
No need for installing any software, just open the index.html file in your favorite browser.


## Project

Mobile responsive single-page, using Asynchronous requests to fetch data from Google and Foursquare API. 

Knockout was used to handle data from the side bar list, following current state changes.

Responsive navbar was made with Bootstrap 4 and action executed by the hamburguer menu in the mobile mode is handled throw Knockout and jQuery.

Foursquare API is used to retrieve the nearest 5 restaurants in the desired latitude and longitude and also fetches the image in the side bar that is rendered via knockout.

## License
MIT License

Copyright (c) [2019] [Nicholas Lobo]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
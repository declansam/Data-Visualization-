/*

          Assignment 4 - Data Visualization [Introduction to Interactive Media]
          Name - Samyam Lamichhane
          Date - Sept 25, 2022; 

*/




// Canvas size - global variables
let h = 500;
let w = 1200;

let myFont;                // Variable used in preload function
let table;                 // Variable to store all the data loaded from the CSV file
let country_col = 1;       // Column number where country name is stored
let city_col = 2;          // Column number where city name is stored
let lat_col = 3;           // Column number where latitude information is stored
let long_col = 4;         // Column number where longitude information is stored
let elevation_col = 5;    // Column number where elevation information is stored

let num_rows, num_cols;    // Number of rows and columns loaded

// Initial value set to minimum and maximum variables for longitude, latitude and elevation data 
// Iniially set to max value a variable can store for minimum-variable and vice versa. 
// Used for comparison in findMinMaxVal() function
let min_lat = 181; 
let min_long = 181;
let max_lat = -181;
let max_long = -181;
let min_elevation = 900000000;
let max_elevation = 0;

// Arrays used to store country names, city names, latitude value, longitude value and elevation value from the CSV file
let city_arr = [];
let country_arr = [];
let lat_arr = []; 
let long_arr = []; 
let elevation_arr = [];

// Arrays to store mapped information for related variables
let lat_arr_mapped = [];
let long_arr_mapped = []; 
let elevation_arr_mapped = [];


// ------------------------------------------------- Preload ---------------------------------------------------------
function preload()
{
  table = loadTable("world_city_elevation.csv", "csv");      // CSV file is loaded with its name and format as parameters
  myFont = loadFont("caveatFont.ttf");                            // Custom font
}



// ------------------------------------------------- Setup ---------------------------------------------------------
function setup() 
{
  frameRate(24);
  createCanvas(w, h);
  angleMode(DEGREES);
  
  // Error handling -- if the file is NULL, print the information and keep the while loop running forever
  if (table == null)
  {
    print("Can't load the dataset! ");
    
    while(true) 
    {
      print("Stuck Here");
    }
  }
  
  
  // CSV file information
  print("The total number of rows: " + table.getRowCount());
  print("The total number of cols: " + table.getColumnCount());
  
  // Number of rows and columns in table variable
  num_rows = table.getRowCount();
  num_cols = table.getColumnCount();
  
  // Loop through 'table' (i.e. information loaded from CSV file) and store respective information in respective arrays
  // Here, from each row, details are extraced are stored in separate arrays. 
  // Thus, the number of elements in each array is equal to the number of rows
  for (let r = 0 ; r < num_rows; r++)
  {
    // getNum() and getString() have two parameters -- r means the currnt row and the second-parameter determine the cell column
    lat_arr[r] = table.getNum(r, lat_col);
    long_arr[r] = table.getString (r, long_col);
    elevation_arr[r] = table.getNum (r, elevation_col);
    city_arr[r] = table.getString(r, city_col);
    country_arr[r] = table.getString(r, country_col);
  }
  
  // Calling the function to find min and max values and store in global variables
  findMinMaxVal();
  
  
  // Loop though all the arrays created above and map each information to new range and append to new arrays
  for (let i = 0; i < num_rows; i++)
  {
    // Mapped from minimum to maximum value to a range of (height/1.2 to 50)
    let temp_lat = map(float(lat_arr[i]), min_lat, max_lat, h/ 1.2, 50);
    append(lat_arr_mapped, temp_lat);
    
    // Mapped from minimum to maximum value to a range of (10 to width/1.2)
    let temp_long = map(float(long_arr[i]), min_long, max_long, 10, w/ 1.2);
    append(long_arr_mapped, temp_long);
    
    // / Mapped from minimum to maximum value to a range of (0 to 100)
    let temp_elevation = map(float(elevation_arr[i]), min_elevation, max_elevation, 0, 100);
    append(elevation_arr_mapped, temp_elevation);
    
  }
  
}



// ------------------------------------------------- draw function -------------------------------------------------
function draw() 
{ 
  background(0, 0, 0);
  
  
  // MAP FUNCTIONALITY
  for (let i = 0; i < num_rows; i++)
  {
    // Loop through the mapped-array-for-elevation and use differnt fill color for different elevation
    if (elevation_arr_mapped[i] > 80)
    {
      fill(255, 50, 50);                        // Red dot is for a city with elevation in a range greater than 80%
    }
    else
    {
      fill(50, 255, 50);                      // Green dot is for a city with elevation in a range lower than 80%
    }
    
    
    // Store x and y position for each city using mapped arrays, where longitude = x and latitude = y
    let point_x = long_arr_mapped[i];
    let point_y = lat_arr_mapped[i];
    let circle_radius;
    
    
    // HOVER FUNCTIONALITY
    // find the distance between cursor and each city
    let distance = dist(mouseX, mouseY, point_x, point_y);
    
    // If the distance is less than 0.5, call hover_info() function, increase circle radisu and use different fill color
    // Otherwise, lower the circle radius and use green as fill color
    if (distance < 0.5)
    {
      fill("purple");
      circle_radius = 10;
      circle(long_arr_mapped[i], lat_arr_mapped[i], circle_radius);
      
      hover_info(i);
    }
    else
    {
      circle_radius = 5;
      circle(long_arr_mapped[i], lat_arr_mapped[i], circle_radius);
    }
    
  }
  
}



// --------------------------------------- Finding Minimum, Maximum Value -------------------------------------------
function findMinMaxVal()
{
  // Loop through elements of each row using one single loop. 
  // Since each array has the same number of elements, one loop is enough. Thus, time complexity = O(n)
  for (let r = 0 ; r < num_rows; r++)
  {
    // If latitude information in the current row is greater than the value stored in max_lat, update max_lat
    // Similary for longitude and elevation
    if (table.getNum(r, lat_col) > max_lat)
      max_lat = table.getNum(r, lat_col);
    
    // If latitude information in the current row is lower than the value stored in min_lat, update min_lat
    // Similary for longitude and elevation
    if (table.getNum(r, lat_col) < min_lat)
      min_lat = table.getNum(r, lat_col);
    
    if (table.getNum(r, long_col) > max_lat)
      max_long = table.getNum(r, long_col);
    
    if (table.getNum(r, long_col) < min_long)
      min_long = table.getNum(r, long_col);
    
    if (table.getNum(r, elevation_col) > max_elevation)
      max_elevation = table.getNum(r, elevation_col);
    
    if (table.getNum(r, elevation_col) < min_elevation)
      min_elevation = table.getNum(r, elevation_col);
  }
}



// ------------------------------------------------- Hover Text ------------------------------------------------------
function hover_info(index)
{
  // Text Settings
  textSize(20);
  textAlign(LEFT);
  textFont(myFont);
  fill("white");
  stroke(2);
  
  let text_box_pos_x;
  let text_box_pos_y;
  
  // Conditionals to ensure text stays within the canvas. 
  // If cursor is to the extreme right, reset x and y positions for text accordingly
  if (mouseX < (w/2))
  {
    text_box_pos_x = (150);
  }
  else
  {
    text_box_pos_x = (w - 350);
   
  }
  text_box_pos_y = (40);
  
  // Displaying city name, country name and elevation value
  // text("Location: " + city_arr[index] + ", " + country_arr[index] + "\n" + "Elevation: " + elevation_arr[index] + " m", text_box_pos_x, text_box_pos_y, w/4);
  
  
  
  // Call text() to display the required information
  // Displaying just the name of the country and its elevation
  text("Location: " + country_arr[index] + "\n" + "Elevation: " + elevation_arr[index] + " m", text_box_pos_x, text_box_pos_y, w/4);
    
}


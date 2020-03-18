var start = function(){

  var DEFAULT_COLOR = 'black';
  var SWAP_COLOR = 'green';
  var COMPARE_COLOR = 'blue';

  var stop_bool = false;
  var canvas = document.querySelector('canvas');
  this.width = canvas.getBoundingClientRect().width;
  this.height = canvas.getBoundingClientRect().height;

  this.ary = [];
  this.colors = []; 
  this.actions = [];

  var number_of_swaps, number_of_compares;

  function init(){
      var nbars = document.querySelector('.number').value;
      number_of_swaps = 0;
      number_of_compares = 0;
      this.ary = [];
      this.colors = [];
      this.actions = [];
      for(var i=0; i < nbars; i++){
          this.ary.push( Math.floor( Math.random()*(canvas.height-10) ) );
          this.colors.push(DEFAULT_COLOR);
      }
      draw_arr(this.ary, this.colors);
  }

  function draw_arr(ary, colors) {
      var width_ratio = 2;
      var ctx = canvas.getContext('2d');
  
      // Clear the canvas
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Figure out width of bars and spacing
      var n = ary.length;
      var spacing = canvas.width / (width_ratio * n + n + 1);
      var bar_width = spacing * width_ratio;

      var x = spacing;
      for (var i = 0; i < ary.length; i++) {
          ctx.fillStyle = colors[i];
          ctx.fillRect(x, ary[i], bar_width, canvas.height);
          x += spacing + bar_width;
      }
  }

  function compare(arr, i, j){
      this.actions.push([i, j, COMPARE_COLOR]);
      return arr[i] < arr[j];
  }

  function swap(arr, i, j){
      this.actions.push([i, j, SWAP_COLOR]);
      var t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
  }

  function run(actions){
      var t = actions.length;
      var i=0;
      var timeIntervel = 100 - document.querySelector('.time').value;
      var id = setInterval(function(){
          var action = actions[i];
          var x = action[0];
          var y = action[1];
          if(action[2] == SWAP_COLOR){
              var temp = this.ary[ x ];
              this.ary[ x ] = this.ary[ y ];
              this.ary[ y ] = temp;
              number_of_swaps++;
          } else if(action[2] == COMPARE_COLOR){
              number_of_compares++;
          }
          this.colors[ action[0] ] = action[2];
          this.colors[ action[1] ] = action[2];
          draw_arr(this.ary, this.colors);
          this.colors[ action[0] ] = DEFAULT_COLOR;
          this.colors[ action[1] ] = DEFAULT_COLOR;
          i++;
          if(i>=t || stop_bool){
              draw_arr(this.ary ,this.colors); // last 2 bars desnt change their color, if this line is removed
              this.actions = []
              this.ary = []
              clearInterval(id);
              stop_bool = false;
              showTScomp();
          }
      }, timeIntervel);
  }

  function showTScomp(){
      var card = document.querySelector(".clicks").click();
      // card.style.display = "block";
      // $('.message').popover('show');
      document.querySelector(".swaps").innerHTML = "<b>Total swaps: </b>" + number_of_swaps;
      document.querySelector(".compares").innerHTML = "<b>Total compares: </b>" + number_of_compares;

      // $('.message').popover('hide');
      // card.style.display = "hide";
  }

  function bubbleSort(){
      var arr = this.ary.slice();
      this.actions = [];
      for(var i=1; i<arr.length; i++){
          for(var j=0; j<i; j++){
              if(compare(arr, i, j))
                  swap(arr, i, j);
          }
      }
      run(this.actions);
  }

  function selectionSort(){
      var arr = this.ary.slice();
      this.actions = [];
      for(var i=0; i < arr.length; i++){
          var min = i;
          for(var j=i+1; j < arr.length; j++){
              if(compare(arr, j, min))
                  min = j;
          }
          if(i != min)
              swap(arr, i, min);
      }
      run(this.actions);
  }
  
  function insertionSort(){
      var arr = this.ary.slice();
      this.actions = [];
      for (var i = 1; i < arr.length; i++) {
          for (var j = i; j > 0 && compare(arr, j, j - 1); j--) {
              swap(arr, j, j - 1);
          }
      }
      run(this.actions);
  }
  
  function partition(aa, left, right) {
      var pivot = right;
      swap(aa, pivot, right);
      pivot = left;
      for (var i = left; i < right; i++) {
        if (compare(aa, i, right)) {
          if (i != pivot) {
            swap(aa, i, pivot);
          }
          pivot += 1
        }
      }
      swap(aa, right, pivot);
  
      return pivot;
  }
  
  function Qsort(aa, left, right) {
      var n = aa.length;
      if (typeof(left) === 'undefined') left = 0;
      if (typeof(right) === 'undefined') right = n - 1;
  
      if (left >= right) return;
  
      var pivot = partition(aa, left, right);
      Qsort(aa, left, pivot - 1);
      Qsort(aa, pivot + 1, right);
  }

  function QuickSort(){
      var arr = this.ary.slice();
      this.actions = [];
      Qsort(arr, 0, arr.length-1);
      run(this.actions);
  }

  function heapify(input, i, array_length) {
      var left = 2 * i + 1;
      var right = 2 * i + 2;
      var max = i;
  
      if (left < array_length && compare(input, max, left)) {                     //input[left] > input[max]
          max = left;
      }
  
      if (right < array_length && compare(input, max, right)) {                   //input[right] > input[max]
          max = right;
      }
  
      if (max != i) {
          swap(input, i, max);
          heapify(input, max, array_length);
      }
  }

  function heapSort(arr, array_length) {

      for (var i = Math.floor(array_length / 2); i >= 0; i -= 1) {
          heapify(arr, i, array_length);
      }

      for (i = arr.length - 1; i > 0; i--) {
          swap(arr, 0, i);
          array_length--;

          heapify(arr, 0, array_length);
      }
  }

  function hSort(){
      var arr = this.ary.slice();
      this.actions = [];
      heapSort(arr, arr.length);
      run(this.actions)
  }

  init();
  document.querySelector('.bubble').addEventListener('click', function(err){
    init();
    bubbleSort();
  });
  document.querySelector('.insertion').addEventListener('click', function(err){
    init();
    insertionSort();
  });
  document.querySelector('.selection').addEventListener('click', function(err){
    init();
    selectionSort();
  });
  document.querySelector('.quick').addEventListener('click', function(err){
    init();
    QuickSort();
  });
  document.querySelector('.heap').addEventListener('click', function(err){
    init();
    hSort();
  });
  document.querySelector('.stop').addEventListener('click', function(err){
    this.actions = [];
    this.ary = [];
    stop_bool = true;
  });
}
start();
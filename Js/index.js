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
    
    function init(){
        var nbars = document.querySelector('.number').value;
        this.ary = [];
        this.colors = [];
        this.actions = [];
        for(var i=0; i < nbars; i++){
            this.ary.push(1 + Math.floor( Math.random()*(canvas.height - 10) ));
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
    
        // Draw a box around the outside of the canvas
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        var x = spacing;
        for (var i = 0; i < ary.length; i++) {
            ctx.fillStyle = colors[i];
            ctx.fillRect(x, ary[i], bar_width, canvas.height-1);
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
        var timeIntervel = document.querySelector('.time').value;
        var id = setInterval(function(){
            var action = actions[i];
            var x = action[0];
            var y = action[1];
            if(action[2] == SWAP_COLOR){
                var temp = this.ary[ x ];
                this.ary[ x ] = this.ary[ y ];
                this.ary[ y ] = temp;
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
            }
        }, timeIntervel);
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
    
    function check_perm(perm) {
        var n = perm.length;
        var used = {};
        for (var i = 0; i < n; i++) {
          if (used[perm[i]]) return false;
          used[perm[i]] = true;
        }
        for (var i = 0; i < n; i++) if (!used[i]) return false;
        return true;
      }

    function perm_to_swaps(perm) {
        if (!check_perm(perm)) {
          console.log(perm);
          throw "Invalid permutation";
        }
        var n = perm.length;
        var used = [];
        for (var i = 0; i < n; i++) used.push(false);
        var transpositions = [];
    
        for (var i = 0; i < n; i++) {
          if (used[i]) continue;
          var cur = i;
          if (perm[i] == i) used[i] = true;
          while (!used[perm[cur]]) {
            transpositions.push([cur, perm[cur]]);
            used[cur] = true;
            cur = perm[cur];
          }
        }
    
        return transpositions;
    }

    function msort(aa, left, right) {
        if (typeof(left) === 'undefined') left = 0;
        if (typeof(right) === 'undefined') right = aa.length - 1;
    
        if (left >= right) return;
        
        var mid = Math.floor((left + right) / 2);
    
        if (right - left > 1) {
          msort(aa, left, mid);
          msort(aa, mid + 1, right);
        }
        var next_left = left;
        var next_right = mid + 1;
        var perm = [];
        for (var i = left; i <= right; i++) {
          var choice = null;
          if (next_left <= mid && next_right <= right) {
            if (compare(aa, next_left, next_right)) {
              choice = 'L';
            } else {
              choice = 'R';
            }
          } else if (next_left > mid) {
            choice = 'R';
          } else if (next_right > right) {
            choice = 'L';
          }
          if (choice === 'L') {
            perm.push(next_left - left);
            next_left++;
          } else if (choice === 'R') {
            perm.push(next_right - left);
            next_right++;
          } else {
            throw 'Should not get here'
          }
        }
    
        var swaps = perm_to_swaps(perm);
        for (var i = 0; i < swaps.length; i++) {
          swap(aa, swaps[i][0] + left, swaps[i][1] + left);
        }
    }
    function mergeSort(){
        var arr = this.ary.slice();
        this.actions = [];
        msort(arr, 0, arr.length);
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
    document.querySelector('.merge').addEventListener('click', function(err){
      init();
      mergeSort();
    });
    document.querySelector('.stop').addEventListener('click', function(err){
      this.actions = [];
      this.ary = [];
      stop_bool = true;
    });
}
start();
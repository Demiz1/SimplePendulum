//Modal stuff

var modalNames = ["MechModal","SolverModal","VisualizationModal"];

//add functions to the modals
modalNames.forEach(modalFunctionalityAdder);

function modalFunctionalityAdder(ModalName){
  // Get the modal
  var modal = document.getElementById(ModalName);

  // Get the button that opens the modal
  var btn = document.getElementById("open"+ModalName);

  // Get the <span> element that closes the modal
  var span = document.getElementById("close"+ModalName);

  // When the user clicks the button, open the modal
  btn.onclick = function() {
    modal.style.display = "block";
    document.getElementsByTagName('body')[0].classList.add('stop-scrolling');
  }

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
    document.getElementsByTagName('body')[0].classList.remove('stop-scrolling');
  }

  // When the user clicks anywhere outside of the modal, close it
  modal.onclick = function(event) {
    if(event.target == modal){
      modal.style.display = "none";
      document.getElementsByTagName('body')[0].classList.remove('stop-scrolling');
    }
  }
}

//debug, show elem
document.getElementById("open"+modalNames[0]).click();

// Redirection
document.getElementById("GoProfil").addEventListener("click", event => {
    socket.emit("Redirection","../html/profil.html", false);
});
document.getElementById("GoReservation").addEventListener("click", event => {
  socket.emit("Redirection","../html/reservation.html", false);
});

socket.on("Redirection2", data => {
  document.location.href=data; 
});
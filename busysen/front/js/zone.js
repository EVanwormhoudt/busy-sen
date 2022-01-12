var input = document.getElementById('image_uploads');
var preview = document.querySelector('.preview');

input.style.opacity = 0;

input.addEventListener('change', updateImageDisplay);
let imageTT;
function updateImageDisplay() {
    while (preview.firstChild) {
        preview.removeChild(preview.firstChild);
    }

    var curFiles = input.files;
    if (curFiles.length === 0) {
        var para = document.createElement('p');
        para.textContent = 'No files currently selected for upload';
        preview.appendChild(para);
    } else {
        for (var i = 0; i < curFiles.length; i++) {
            var para = document.createElement('p');
            if (validFileType(curFiles[i])) {
                var image = document.querySelector('img');
                image.src = window.URL.createObjectURL(curFiles[i]);
                imageTT = image.src;
                document.getElementById("etagenb").hidden = false;

                document.getElementById("text_top").innerHTML = "Votre étage :";

            } else {
                para.textContent = "Erreur"
            }
        }
    }
}

var fileTypes = [
    'image/jpeg',
    'image/png'
]

function validFileType(file) {
    for (var i = 0; i < fileTypes.length; i++) {
        if (file.type === fileTypes[i]) {
            return true;
        }
    }
    return false;
}

let tabpointsSalle = [];
let imgNew = document.getElementById('newetage');
let verif = false;
let salles = [];
let levelnew = [];
let verif_nb_carre = 0;
let verifFinal = false;
let area = document.createElement('area');
let tab_area = [];
if (imgNew != null && verif == false) {
    document.getElementById("etagenb").addEventListener('submit', (e) => {
        e.preventDefault();
        etage = parseInt(document.getElementById('etage').value);
        console.log(etage);
        document.getElementById("etagenb").hidden = true;
        document.getElementById("valider").hidden = false;


        imgNew.addEventListener('click', (event) => {
            //console.log(event.clientX, event.clientY);
            if (verif == true) return 0;
            let point = [];
            point[0] = event.clientX;
            point[1] = event.clientY - 30;
            tabpointsSalle.push(point);

            //console.log(tabpointsSalle);
            if (tabpointsSalle.length == 2) {
                let otherptn1 = [];
                otherptn1.push(tabpointsSalle[1][0], tabpointsSalle[0][1]);
                let otherptn2 = [];
                otherptn2.push(tabpointsSalle[0][0], tabpointsSalle[1][1]);
                let finalzone = [];
                finalzone.push(tabpointsSalle[0], otherptn1, tabpointsSalle[1], otherptn2);
                //console.log(finalzone);
                let map = document.querySelector('map');

                area.coords = [tabpointsSalle[0][0], tabpointsSalle[0][1], tabpointsSalle[1][0], tabpointsSalle[1][1]];
                tab_area.push(area.coords);

                area.shape = "rect";
                area.target = "";
                area.alt = "";
                area.title = "";
                area.href = "#!";
                map.appendChild(area);
                verif_nb_carre++;
                tabpointsSalle = [];
                point = [];
                otherptn1 = [];
                otherptn2 = [];

                var mh = new MapHighlight(document.getElementsByTagName('img')[0], salles.length, true, true, true);
                mh.highlight();

                document.getElementById("form_new").hidden = false;

                verif = true;

                let verif2 = false;

                document.getElementById("form_new").addEventListener("submit", (e) => {
                    e.preventDefault();

                    let salle = document.getElementById("salle").value;
                    let prs = document.getElementById("prs").value;
                    let proj = document.getElementById("proj").checked ? 1 : 0;

                    if (verif2 == false) {
                        salles.push({ "name": salle.toUpperCase(), "level": etage, "capacity": parseInt(prs), "reservations": [], "projector": parseInt(proj), "coords": tab_area });    
                        levelnew.push({"level":etage,"img": imageTT});
                        tab_area = [];
                        verif2 = true;
                        console.log(levelnew);
                    }
                    document.getElementById("form_new").hidden = true;
                    document.getElementById('erreur_crea').innerHTML = "";

                    verif = false;
                });

            }
            document.getElementById("valider").addEventListener('click', (e) => {
                e.preventDefault();
                console.log(salles);
                console.log(tab_area);
                if (salles.length != verif_nb_carre) {
                    document.getElementById('erreur_crea').innerHTML = "Vous devez finir de créer la salle avant de valider";
                }
                else if (salles.length == verif_nb_carre) {


                    if (verifFinal == false) {

                        socket.emit('create_etage', salles);

                        socket.on('erreur_crea_etage', name => {
                            document.getElementById('erreur_crea').innerHTML += "\nLe nom de salle : " + name + " est deja utilisé !";



                            let index2;
                            for (let i in salles) {
                                if (salles[i].name == name) index2 = i;
                            }
                            document.getElementById('div' + index2).remove();
                            salles.splice(index2, 1);

                        });

                        socket.on('valid', () => {
                            console.log(salles, levelnew);
                            document.getElementById("popup").hidden = false;
                            document.getElementsByName("img").disabled = true;
                        })
                        verifFinal = true;

                    }

                }
                else {
                    document.getElementById('erreur_crea').innerHTML = "";
                }
            })
        });
    });
}

document.getElementById("valider").addEventListener('click', () => {
    if (salles.length == 0) {
        document.getElementById('erreur_crea').innerHTML = "Vous n'avez pas crée de salle";
    }
});
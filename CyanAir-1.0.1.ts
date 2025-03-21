// Cyan Air
// Librería JavaScript liviana para desarrollar aplicaciones web basadas en componentes.
// MIT License
// Copyright (c) 2025 Gabriel Lucero
// Email: pensadornatural@gmail.com

namespace CyanAir {
    export const Const = {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE'
    }

    export class CyanAir {
        //En esta pila se almacenan todos los objetos que están escuchando los mensajes que emitan los demás objetos, hasta que salgan de esta pila cuando dejen de escuchar.
        //La pila contiene por defecto el elemento "CyanAir".
        private static objectsListening: string[] = ["CyanAir"];

        constructor() {
        }

        //Carga sincrónica del archivo a importar para insertarlo en el DOM del documento HTML.
        //Los componentes pueden tener una sección <STYLE></STYLE>, luego código HTML y al final, una sección <SCRIPT></SCRIPT>.
        //También se permiten componentes solo de código HTML o solo de código JavaScript, pero no solo de CSS, los que podrán importarse en el <header> del documento de la forma tradicional.
        public static Import(componentFile: string) {
            function extraerCaracteresAlfabeticos(texto: string) {
                let resultado = '';
                for (let i = 0; i < texto.length; i++) {
                    let caracter = texto[i];
                    if (caracter.match(/[a-zA-Z-\_]/)) {
                        resultado += caracter;
                    }
                }
                return resultado;
            }

            //Asignar como id del componente la última parte de la ruta dada, desde el caracter después del último eventual signo "/" hasta antes del punto de la extensión.
            //Se aceptan solo caracteres a-z, A-Z y -.
            //Por ejemplo, si la ruta dada como parámetro del componente es "./lib/js/encabezado-principal.html", el id que se asignará aquí al componente será "encabezado-principal".
            let componentId = String(componentFile.split(".").slice(-2, -1));
            if (componentId.indexOf("/") != -1) {
                componentId = String(componentId.split("/").slice(-1));
            }
            componentId = extraerCaracteresAlfabeticos(componentId);

            let xhr = new XMLHttpRequest();
            
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        //Detectar si el componente cargado solo contiene una sección <style></style> y código HTML, o si incluye una sección <script></script>,
                        //en cuyo caso se insertará por separado en el DOM como elemento SCRIPT.
                        let nodoBody = document.getElementsByTagName("BODY")[0];
                        let nodoNuevoHTMLCSS;
                        let nodoNuevoSCRIPT;
                        let codigoHTMLCSS = '';
                        let codigoSCRIPT = '';

                        if (xhr.responseText.indexOf("<script>") == -1) { //Solo hay código CSS y HTML.
                            codigoHTMLCSS = xhr.responseText;
                        } else {
                            //Se asume que solo hay una sección <SCRIPT></SCRIPT> por archivo.
                            codigoHTMLCSS = xhr.responseText.substring(0, xhr.responseText.indexOf("<script>"));
                            codigoSCRIPT = xhr.responseText.substring(xhr.responseText.indexOf("<script>") + 8, xhr.responseText.indexOf("</script>"));
                        }

                        if (codigoHTMLCSS != '') {
                            nodoNuevoHTMLCSS = document.createElement("DIV");
                            nodoNuevoHTMLCSS.setAttribute("id", componentId);
                            nodoNuevoHTMLCSS.innerHTML = codigoHTMLCSS;
                            nodoBody.appendChild(nodoNuevoHTMLCSS);

                            //Añadir al objeto a la lista de objetos escuchando.
                            CyanAir.Listening(componentId);

                            //Crear objeto del componente.
                            window[componentId] = new Component(componentId, false);
                        }
                        if (codigoSCRIPT != '') {
                            nodoNuevoSCRIPT = document.createElement("SCRIPT");
                            if (codigoHTMLCSS == '') { //El componente solo contiene código JavaScript.
                                nodoNuevoSCRIPT.setAttribute("id", componentId);
                            }
                            nodoNuevoSCRIPT.innerHTML = codigoSCRIPT;
                            nodoBody.appendChild(nodoNuevoSCRIPT);

                            //Añadir al objeto a la lista de objetos escuchando.
                            if (codigoHTMLCSS == '') { //El componente solo contiene código JavaScript.
                                CyanAir.Listening(componentId);

                                //Crear objeto del componente.
                                window[componentId] = new Component(componentId, true);
                            }
                        }

                        try {
                            window[componentId + "_OnLoaded"].apply(this);
                        } catch(e) {}
                        CyanAir.Talk(componentId, componentId + "_OnLoaded", componentFile);
                    } else {
                        try {
                            window[componentId + "_OnLoadingError"].apply(this);
                        } catch(e) {}
                        console.log("Error: object " + componentFile + " could not be loaded.");
                        CyanAir.Talk(componentId, componentId + "_OnLoadingError", componentFile);
                    }
                }
            }
            xhr.open('GET', componentFile, false);
            xhr.send();
        }

        public static Talk(componentId: string, message: string, metaMessage: any = "") {
            // Lanzar evento de reacciones a la acción Talk en todos los objetos que estén escuchando.
            let listaObjetosEscuchando = [...CyanAir.GetObjectsListening()]

            listaObjetosEscuchando.forEach(element => {
                try {                    
                    window[element + "_Listen"].call(this, componentId, message, metaMessage);
                } catch(e) {}
            });
        }

        public static Listening(componentId: string, escuchando = true) {
            if (escuchando) {
                //Agregar el objeto a la pila de objetos que están escuchando.
                CyanAir.objectsListening.push(componentId);
            } else {
                //Eliminar al objeto de la pila de objetos que están escuchando.
                for (let i:number = 0; i < CyanAir.objectsListening.length; i++) {
                    if (CyanAir.objectsListening[i] == componentId) {
                        CyanAir.objectsListening.splice(i,1);
                    }
                }
            }
        }

        public static GetObjectsListening() {
            return CyanAir.objectsListening;
        }
    }

    //Para cada archivo importado, Cyan Air crea un objeto llamado igual al Id que el método Import asignó a partir de la ruta, que posee algunos métodos y propiedades útiles.
    export class Component {
        private Id: string;
        
        //Define si el tipo de componente solo es código JavaScript o contiene HTML.
        //Esto es porque hay acciones que solo son válidas para código HTML.
        private JavaScriptOnly: boolean;
        
        private Visibility: boolean = true;
        private Display: boolean = true;
        private Opacity: boolean = true;
        
        constructor(id: string, JSOnly: boolean = false) {
            this.Id = id;
            this.JavaScriptOnly = JSOnly;
        }

        public Listening(escuchando: boolean = true) {
            CyanAir.Listening(this.Id, escuchando)
        }

        public Talk(message: string, metaMessage: any = "") {
            CyanAir.Talk(this.Id, message, metaMessage)
        }

        public SetVisibility(activado: boolean = true) {
            if (!this.JavaScriptOnly) {
                this.Visibility = activado;
                
                if (activado) {
                    document.getElementById(this.Id).style.visibility = "initial";
                } else {
                    document.getElementById(this.Id).style.visibility = "hidden";
                }
            }
        }

        public GetVisibility() {
            return this.Visibility;
        }

        public SetDisplay(activado: boolean = true) {
            if (!this.JavaScriptOnly) {
                this.Display = activado;

                if (activado) {
                    document.getElementById(this.Id).style.display = "initial";
                } else {
                    document.getElementById(this.Id).style.display = "none";
                }
            }
        }

        public GetDisplay() {
            return this.Display;
        }

        public SetOpacity(activado: boolean = true) {
            if (!this.JavaScriptOnly) {
                this.Opacity = activado;

                if (activado) {
                    document.getElementById(this.Id).style.opacity = "initial";
                } else {
                    document.getElementById(this.Id).style.opacity = "0";
                }
            }
        }

        public GetOpacity() {
            return this.Opacity;
        }
        
        public Show() {
            if (!this.JavaScriptOnly) {
                document.getElementById(this.Id).style.opacity = "initial";
                document.getElementById(this.Id).style.visibility = "initial";
                document.getElementById(this.Id).style.display = "initial";
            }
        }

        //Eliminar el componente del DOM.
        public Delete() {
            if (!this.JavaScriptOnly) {
                //Eliminar el componente del DOM.
                document.getElementById(this.Id).remove();

                //Eliminar componente de la lista de componentes escuchando.
                this.Listening(false);
                
                //Liberar el objeto asociado al componente.
                window[this.Id] = null;                
            }
        }

        //Habilitar/deshabilitar elementos hijo contenidos en el componente.
        //No se habilitan/deshabilitan los nodos hijo, sino que el DIV que encierra al componente se fija
        //para que reaccione o no reaccione a aventos.
        public Enabled(activado: boolean = true) {
            if (!this.JavaScriptOnly) {
                let nodo = document.getElementById(this.Id);

                if (activado) {
                    nodo.style.pointerEvents = "auto";
                    nodo.style.cursor = "auto";
                    nodo.style.opacity = "1";
                } else {
                    nodo.style.pointerEvents = "none";
                    nodo.style.cursor = "not-allowed";
                    nodo.style.opacity = "0.6";
                }
            }
        }
    }

    export function Import(componentFile: string) {
        CyanAir.Import(componentFile);
    }

    export function Talk(componentId: string, message: string, metaMessage: any = "") {
        CyanAir.Talk(componentId, message, metaMessage);
    }

    export function Listening(componentId: string, escuchando = true) {
        CyanAir.Listening(componentId, escuchando);
    }

    export function GetObjectsListening() {
        return CyanAir.GetObjectsListening();
    }
}

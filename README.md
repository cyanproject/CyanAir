# Cyan Air
Librería JavaScript liviana para desarrollar aplicaciones web basadas en componentes.

## Cómo usar Cyan Air

Descarga el archivo *CyanAir-1.0.0.js* (o la versión que corresponda) y añádelo a tu proyecto en la sección **`<head></head>`** de tus archivos **.html**. Luego, en cada una de esas páginas podrás importar tus componentes web para construir tu aplicación, y ellos podrán interactuar entre sí a través de mensajes, mensajes que publican unos mediante el método **Talk** y que todos escuchan mediante la función **Listen**, donde se programan las reacciones de otros.

Un componente es un archivo que se escribe con HTML, CSS y JavaScript clásicos, y que además Cyan Air crea como objeto con métodos y propiedades adicionales. Los componentes pueden tener hasta tres secciones:

* **<style></style>**: sección donde se escriben los estilos con CSS.
* **HTML**: sección donde se escribe el código HTML.
* **<script></script>**: sección donde se escribe el código JavaScript para manipular el componente.

Cada componente puede tener las secciones CSS, HTML y JavaScript, o solo las secciones CSS y HTML, o solo la sección JavaScript. En los primeros dos casos, el archivo debe llevar extensión **.html**, y en el tercer caso, **.js**. Un archivo solo con estilos CSS puede incorporarse a una página web de la manera tradicional.

Para incorporar a una página web un componente, simplemente usa el método **Import** de esta manera:

**`<script>CyanAir.Import('ruta_del_archivo.[html] | [js]');</script>`**.

En ese momento, el código del componente será insertado en la página, y se va insertando secuencialmente. Incluso puedes escribir código HTML entre la importación de varios componentes, y este será renderizado en el mismo orden. Por ejemplo, en el siguiente código:

```
<script>CyanAir.Import('componente1.html');</script>
<h1>CÓDIGO HTML</h2>
<script>CyanAir.Import('componente2.html');</script>
```

, el título *CÓDIGO HTML* aparecerá renderizado después de renderizado el componente 1 y antes de renderizarse el componente 2.

## Ejemplo de componente

Imagina que tienes una página web donde quieres insertar un video de fondo en un DIV. Esto podría construirse como un componente de la siguiente manera:

**Archivo: visor_video.html**
```
<style>
    .video-container {
        position: relative;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        margin: 0;
    }
    
    .video-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: -1;
    }
</style>

<div class="video-container">
    <video autoplay loop muted class="video-background">
        <source src="archivo_video.mp4" type="video/mp4">
    </video>
</div>

<script>
    function visor_video_OnLoaded() {
        visor_video.SetDisplay(false);
    }

    function visor_video_Listen(id, mensaje, metaMensaje) {
        if (mensaje == 'opción ver video pulsado') {
            visor_video.SetDisplay(true);
        }
    }
</script>
```

Más adelante se explica el evento **OnLoaded** y la función **Listen**, que en este caso son utilizados para especificar que el componente es ocultado cuando termina de importarse, y mostrado cuando Cyan Air o algún componente emita el mensaje con el método ***Talk("opción ver video pulsado")*** cuando se pulse un botón u opción de menú para verlo, por ejemplo. Independiente a esto, el componente **visor_video.html** ya puedes usarlo en tu página web -por ejemplo, index.html-, de la siguiente forma:

**Archivo: index.html**
```
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <!-- Librería Cyan Air-->
        <script type="text/javascript" src="./CyanAir-1.0.0.js"></script>
    </head>
    
    <body>
        <script>CyanAir.Import('./visor_video.html');</script>
    </body>
</html>
```

En general, así podría lucir una página web utilizando varios componentes:

```
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <!-- Librería Cyan Air-->
        <script type="text/javascript" src="./CyanAir-1.0.0.js"></script>
    </head>
    
    <body>
        <script>CyanAir.Import('./components/encabezado.html');</script>
        <script>CyanAir.Import('./components/servicios.html');</script>
        <script>CyanAir.Import('./components/visor_video.html');</script>
        <script>CyanAir.Import('./components/noticias.html');</script>
        <script>CyanAir.Import('./components/contacto.html');</script>
        <script>CyanAir.Import('./components/footer.html')</script>
    </body>
</html>
```

## Nombres de archivos de los componentes
Los nombres de los archivos de los componentes pueden tener letras mínúculas o mayúsculas, y el signo *_*. Por ejemplo: **visor_video.html**, **subida_de_archivos.js**, etc. Se usa la extensión **.html** cuando el componente incluye al menos la sección HTML, y la extensión **.js** cuando solo incluye sección JavaScript. Se distinguen así componentes HTML y componentes JavaScript.

## Objeto creado por Cyan Air para cada componente HTML
Si un componente contiene código HTML, entonces Cyan Air creará un objeto llamado igual que la última parte de la ruta del archivo, sin la extensión. Por ejemplo, si el componente es **./components/componente1.html**, Cyan Air, después de insertarlo en el DOM (cuando se ejecute el método **Import**), tomará como nombre solo **componente1** y creará automáticamente un objeto llamado **componente1**. Luego, a partir de ese momento, **componente1** adquiere algunas propiedades y métodos útiles para la interactividad de la aplicación web.

## Propiedades y métodos de Cyan Air:
* **Import(archivoComponente: string, idNodoPadre: string = '', clases: string = '')**: sincrónicamente lee el código CSS, HTML y JavaScript del archivo especificado con ruta y nombre en el parámetro **archivoComponente**, e inserta en la página web las secciones CSS y JavaScript, y en el DOM la sección HTML, como hijo del nodo con el id especificado en **idNodoPadre**, con las clases dadas en **clases** (separadas por un espacio). Si no se especifica un nodo padre, el componente se inserta en el BODY.
* **GetObjectsListening()**: devuelve una lista de todos los objetos que están escuchando en ese momento. Cyan Air siempre está escuchando.

## Propiedades, eventos y métodos de los componentes HTML
* **NombreObjeto_OnLoaded()**: función de evento que se ejecuta cuando el componente llamado ***NombreObjeto*** (usa el nombre de tu propio objeto) es importado completa y correctamente. Cyan Air publica en ese momento el mensaje ***NombreObjeto_OnLoaded***.
* **NombreObjeto_OnLoadingError()**: función que se ejecuta cuando falla la importación de un componente. Cyan Air imprime un mensaje de error en la consola y publica el mensaje ***NombreObjeto_OnLoadingError***.
* **Listening(escuchando: boolean = true)**: indica a Cyan Air si el objeto está o no escuchando mensajes, según si **escuchando** es ***true*** o ***false***. Por defecto, todo componente está escuchando.
* **Talk(message: string, metaMessage: any = "")**: publica el mensaje **message** y el metamensaje **metaMessage**. El metamensaje puede utilizarse para compartir datos, por ejemplo.
* **SetVisibility(activado: boolean = true)**: especifica si el atributo **visibility** es ***initial*** (visible) o ***hidden*** (oculto, conservando el espacio que ocupa), según si el valor de **activado** es ***true*** o ***false*** (por defecto es ***true***).
* **GetVisibility()**: devuelve ***true*** o ***false***, según si el atributo **visibility** es ***initial*** o ***hidden***.
* **SetDisplay(activado: boolean = true)**: especifica si el atributo **display** es ***initial*** (visible) o ***none*** (oculto sin dejar el espacio que ocupaba), según si el valor de **activado** es ***true*** o ***false*** (por defecto es ***true***).
* **GetDisplay()**: devuelve ***true*** o ***false***, según si el atributo **display** es ***initial*** o ***none***.
* **SetOpacity(activado: boolean = true)**: especifica si el atributo **opacity** es ***initial*** (visible) o ***0*** (transparente, conservando el espacio que ocupa), según si el valor de **activado** es ***true*** o ***false*** (por defecto es ***true***).
* **GetOpacity()**: devuelve ***true*** o ***false***, según si el atributo **opacity** es ***initial*** o ***0***.
* **Show()**: hace visible un objeto, independiente de si está oculto mediante **visibility**, **display** u **opacity**.
* **Delete()**: elimina el objeto del DOM, lo elimina de la lista de objetos escuchando, y elimina el objeto mismo, por lo que no podrá volver a referenciarse.

---

## PARTICIPACIÓN

Este proyecto es open source, y queda disponible a la comunidad tanto para su uso como para participar activamente, sea proponiendo y programando nuevas características, realizando pruebas, difundiendo o aportando ideas. Todos son bienvenidos.

**Para colaborar desarrollando:**

Toma uno de los issues (puedes proponer nuevos) y crea una rama para desarrollarlo editando el archivo *CyanAir-1.0.0.ts* (o la versión que corresponda). Cuando termines, realiza un Pull Request. Ya luego subiremos una nueva versión tanto del archivo .ts como de la librería minificada .js para su uso.

Muchísimas gracias.

# Licencia

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2025, Gabriel Lucero

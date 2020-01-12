/*
 * Modelo
 */
var Modelo = function () {

  this.cargar();

  this.preguntas = [];
  this.ultimoId = 0;

 

  //inicializacion de eventos
  this.preguntaAgregada = new Evento(this);
  this.preguntaEliminada = new Evento(this);
  this.preguntasEliminadas = new Evento(this);
  this.preguntaEditada = new Evento(this);
  this.votosAgregados = new Evento(this);
};

Modelo.prototype = {
  //se obtiene el id más grande asignado a una pregunta
  obtenerUltimoId: function () {
    if (this.preguntas.length == 0) {
      return 0;
    }
    else {
      this.ultimoId = this.preguntas[this.preguntas.length - 1].id;
      return this.ultimoId;
    }
  },

  //se agrega una pregunta dado un nombre y sus respuestas
  agregarPregunta: function (nombre, respuestas) {
    var id = this.obtenerUltimoId();
    this.ultimoId = id++;
    var nuevaPregunta = { 'textoPregunta': nombre, 'id': id, 'cantidadPorRespuesta': respuestas };
    this.preguntas.push(nuevaPregunta);
    this.guardar();
    this.preguntaAgregada.notificar();
  },

  borrarPregunta: function (id) {
    var indexId = this.preguntas.findIndex(elem => elem.id === id);
    if (indexId > -1) {
      this.preguntas.splice(indexId, 1);
      this.guardar();
      this.preguntaEliminada.notificar();
    }

  },

  borrarTodo: function () {
    this.preguntas = [];
    this.guardar();
    this.preguntasEliminadas.notificar();
  },

  editarPregunta: function (id, editar) {
    var indexId = this.preguntas.findIndex(elem => elem.id === id);
    if (indexId === -1) {
      alert("Seleccione una pregunta para modificar.")
    }
    else {
      this.preguntas[indexId].textoPregunta = editar;
      this.guardar();
      this.preguntaEditada.notificar();
    }
  },

  agregarVotos: function (nombrePregunta, respuestaSeleccionada) {
    var pregunta = this.preguntas.find(pregunta => pregunta.textoPregunta == nombrePregunta);
    var respuesta = pregunta.cantidadPorRespuesta.find(respuesta => respuesta.textoRespuesta == respuestaSeleccionada);
    if (respuesta === undefined) {
      alert("Seleccione una respuesta para la pregunta " + nombrePregunta + ".");
    }
    else {
      respuesta.cantidad += 1;
      this.guardar();
      this.votosAgregados.notificar();
    }
  },

  //se guardan las preguntas

  guardar: function () {
    localStorage.setItem("preguntas", JSON.stringify(this.preguntas));
  },

  cargar: function () {
    this.preguntas = JSON.parse(localStorage.getItem("preguntas"));
  }

};

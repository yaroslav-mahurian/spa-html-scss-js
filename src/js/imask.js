import IMask from 'imask/esm/imask';
import 'imask/esm/masked/base';

export default function maskData() {
  const [nameField, emailField, serviceField, phoneField, dateField, timeField, notesField] = document.querySelectorAll('[data-form-elem]');

  var dateMask = IMask(
      dateField,
      {
        mask: Date,
        min: new Date(),
        max: new Date(2022, 0, 1),
        lazy: true,
      });

  var phoneMask = IMask(
    phoneField,
      {
        mask: '+{(380)}00-000-00-00'
      });
  var timeMask = IMask(
    timeField, 
    {
      mask: 'h{:}m',
      lazy: true,

      blocks: {
        h: {
          mask: IMask.MaskedRange,
          from: 0,
          to: 24
        },
        m: {
          mask: IMask.MaskedRange,
          from: 0,
          to: 60
        }
      }
  });
}
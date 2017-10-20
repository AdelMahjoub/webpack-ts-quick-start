import * as img from './assets/images/ts-logo.png';
import './assets/scss/index.scss';

/**
 * 
 * @class App
 */
class App {

  /**
   * 
   * @static
   * @memberof App
   */
  public static main(): void {

    const logo = document.createElement('img');
    logo.src = img.toString();
    (<HTMLDivElement>document.querySelector('#root')).appendChild(logo);
  }
}

window.addEventListener('DOMContentLoaded', App.main);
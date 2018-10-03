import {MutableData} from "@polymer/polymer/lib/mixins/mutable-data";
import {PolymerElement} from "@polymer/polymer/polymer-element";
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import {FlattenedNodesObserver} from "@polymer/polymer/lib/utils/flattened-nodes-observer";
import '@polymer/paper-styles/paper-styles.js';
import '@polymer/iron-selector/iron-selector.js';
import './ud-step.js';
import '@polymer/iron-icon/iron-icon.js';
import './ud-iconset.js';

/**
 * `ud-stepper`
 * Material Design Stepper
 *
 * ### Styling
 *
 * The following custom properties and mixins are available for styling:
 *
 * Custom Property | Description | Default
 * ----------------------|-------------|--------
 * `--ud-stepper-header-container-style` | Style mixin for the header container | `{}`
 * `--ud-stepper-icon-completed-color` | The icon color of a completed step | `--google-blue-500`
 * `--ud-stepper-icon-error-color` | The icon color of a step with error | `--paper-deep-orange-a700`
 * `--ud-stepper-icon-selected-color` | The icon color of a selected step | `--google-blue-500`
 *
 * @customElement
 * @polymer
 * @memberof UrDeveloper
 * @demo demo/index.html
 */
class UdStepperElement extends MutableData(PolymerElement) {
  static get template() {
    return html`
    <style include="paper-styles">
      :host {
        display: flex;
        flex-direction: column;
      }

      .header-container {
        display: flex;
        flex-direction: row;

        flex-wrap: nowrap;
        align-items: center;
        @apply --ud-stepper-header-container-style;
      }

      /* Horizontal Styles */

      .header {
        display: flex;
        flex-direction: row;
        justify-content: center;
        overflow: hidden;
      }

      :host(:not([vertical])) .header:not(:last-of-type) {
        flex: 1;
      }

      :host(:not([vertical])) .header:not(:last-of-type)::after {
        content: '';
        display: inline-block;
        position: relative;
        flex: 1;
        top: 36px;
        height: 1px;
        margin-left: -12px;
        width: 200px;
        background-color: rgba(0, 0, 0, 0.1);
      }

      .header .label {
        display: flex;
        flex-direction: row;
        cursor: pointer;
        align-items: center;
        padding: 24px 24px 24px 24px;
      }

      .header .label:hover {
        background-color: #f0f0f0;
      }

      .label-icon {
        color: rgba(0, 0, 0, 0.38);
        @apply --paper-font-caption;
        text-align: center;
        line-height: 24px;
      }

      .label-text {
        @apply --paper-font-body2;
        padding-left: 8px;
        color: rgba(0, 0, 0, 0.54);
      }

      .label-text .optional,
      .label-text .summary {
        @apply --paper-font-caption;
      }

      :host(:not([vertical])) .label-text .main {
        @apply --paper-font-common-nowrap;
        max-width: 120px;
      }

      .header.selected .label-icon,
      .header[completed] .label-icon {
        color: var(--ud-stepper-icon-completed-color, var(--google-blue-500));
      }

      .header.selected .label-text,
      .header[completed] .label-text {
        color: rgba(0, 0, 0, 0.87);
      }

      .header[error] .label-text,
      .header[error] .label-icon {
        color: var(--ud-stepper-icon-error-color, --paper-deep-orange-a700);
      }

      .step-number {
        color: white;
        background-color: rgba(0, 0, 0, 0.38);
        border-radius: 50%;
        line-height: 24px;
        width: 24px;
        height: 24px;
        max-height: 24px;
        max-width: 24px;
      }

      .header.selected .step-number {
        background-color: var(--ud-stepper-icon-selected-color, var(--google-blue-500));
      }

      /* Vertical Styles */

      :host([vertical]) .header-container {
        flex-direction: column;
        flex-wrap: nowrap;
        align-items: stretch;
      }

      :host([vertical]) .header {
        flex-direction: column;
        justify-content: flex-start;
        overflow: visible;
      }

      :host([vertical]) .vertical-step ::slotted(ud-step) {
        flex: 1;
      }

      .vertical-step {
        padding-left: 32px;
        display: flex;
        flex-flow: row;
        align-items: stretch;
      }

      .header:not(:last-of-type) .vertical-step::before {
        content: '';
        display: inline-block;
        position: relative;
        width: 1px;
        left: 3px;
        margin-top: -10px;
        margin-bottom: -16px;
        background-color: rgba(0, 0, 0, 0.1);
      }

      :host([vertical]) .header .label {
        padding: 24px 24px 16px 24px;
      }

      ::slotted(ud-step:not([selected])) {
        display: none;
      }

      .vertical-step ::slotted(ud-step:not([selected])) {
        display: none;
      }
    </style>
    <iron-selector id="selector" class="header-container" selectable=".header.selectable" selected-class="selected" selected="{{selected}}" on-iron-activate="_handleStepActivate" selected-attribute="selected">
      <dom-repeat items="[[_steps]]" mutable-data="">
        <template>
          <div class="header selectable" completed\$="[[item.completed]]" error\$="[[item.error]]">
            <div class="label">
              <div class="label-icon">
                <dom-if if="[[item._currentIcon]]">
                  <template>
                    <iron-icon icon="[[item._currentIcon]]"></iron-icon>
                  </template>
                </dom-if>
                <dom-if if="[[!item._currentIcon]]">
                  <template>
                    <div class="step-number">[[_getStepNumber(index)]]</div>
                  </template>
                </dom-if>
              </div>
              <div class="label-text">
                <div class="main">[[item.title]]</div>
                <div class="summary">[[item.summary]]</div>
                <dom-if if="[[item.optional]]">
                  <template>
                    <div class="optional">[[item.optionalText]]</div>
                  </template>
                </dom-if>
              </div>
            </div>
            <dom-if if="[[vertical]]" restamp="">
              <template>
                <div class="vertical-step step-container" visible\$="[[item.selected]]">
                  <slot name="slot[[index]]"></slot>
                </div>
              </template>
            </dom-if>
          </div>
          
        </template>
      </dom-repeat>
    </iron-selector>
    <dom-if if="[[!vertical]]" restamp="">
      <template>
        <slot name="horizontal"></slot>
        
      </template>
    </dom-if>
`;
  }

  static get is() {
    return 'ud-stepper';
  }

  static get properties() {
    return {
      /**
       * If true, the stepper becomes vertical.
       */
      vertical: {
        type: Boolean,
        value: false,
        reflectToAttribute: Boolean
      },

      /**
       * If true, the stepper becomes linear.
       */
      linear: {
        type: Boolean,
        reflectToAttribute: Boolean
      },

      _steps: {
        type: Array
      },

      /**
       * Gets or sets the currently selected step index (zero based).
       **/
      selected: {
        type: String,
        notify: true,
        observer: '_selectionChanged'
      },

      /**
       * Determines if the stepper is compeleted. The stepper is completed when all its non-optional steps are completed.
       **/
      completed: {
        type: Boolean,
        notify: true,
        reflectToAttribute: true,
        computed: '_isCompleted(_steps)'
      }
    };
  }

  static get observers() {
    return ['_setSlotNames(_steps,vertical)']
  }

  constructor() {
    super();
    this._templateObserver = new FlattenedNodesObserver(this, info => {
      if (info.addedNodes.filter(this._isStep).length > 0 ||
        info.removedNodes.filter(this._isStep).length > 0) {
        this._steps = this._findSteps();
        this._prepareSteps(this._steps);
        if (!this.selected) {
          this.selected = 0;
        }
      }
    });
  }

  ready() {
    super.ready();
    this.addEventListener('step-action', evt => this._handleStepAction(evt));
    this.addEventListener('step-error', evt => {
      this.notifyPath('_steps')
    });
  }

  _findSteps() {
    return Array.from(this.querySelectorAll('ud-step'));
  }

  _prepareSteps(steps) {
    steps.forEach((step, i) => {
      //don't overwrite the step's actions, if they're already set
      if (step.actions) return;

      //By default all steps have continue and cancel action
      const actions = [{
        name: 'continue'
      }, {
        name: 'cancel'
      }];
      if (!this.linear) {
        //Disable the back for the first step
        actions.push({
          name: 'back',
          disabled: i === 0
        })
      } else if (step.optional) {
        //In linear stepper, optional step has a skip action
        actions.push({
          name: 'skip'
        });
      }
      step.actions = actions;
    });
  }

  _isStep(node) {
    return node.nodeType === Node.ELEMENT_NODE && /ud-step/i.test(node.localName);
  }

  _getStepNumber(index) {
    return index + 1;
  }

  _handleStepAction(evt) {
    const actionHandler = this[evt.detail.toLowerCase()];
    if (actionHandler) actionHandler.apply(this, [evt.target]);
  }

  _findNextStep(currentStep) {
    if (currentStep == this._steps.length - 1) return currentStep;
    //if it's a linear stepper, find the next not completed or editable step
    if (this.linear) {
      let index = currentStep + 1;
      while (index < this._steps.length - 1) {
        let step = this._steps[index];
        if (step.editable || !step.completed) {
          return index;
        }
        index++;
      }
      return index;
    } else {
      return currentStep + 1;
    }
  }

  /**
   * Go to the next available step
   */
  next() {
    if (!this._steps) return;
    this.continue(this._steps[this.selected]);
  }

  /** @protected */
  continue(step) {
    if (this.linear && step.error) return;
    step.completed = true;
    this.notifyPath('_steps');
    this.selected = this._findNextStep(this.selected);
  }

  /** @protected */
  back(step) {
    if (this.selected > 0) {
      this.selected = this.selected - 1;
    }
  }

  /** @protected */
  skip(step) {
    this.selected = this._findNextStep(this.selected);
  }

  /** @protected */
  cancel(step) {

  }

  /**
   * Reset the stepper and all its steps to the initial state.
   */
  reset() {
    this.selected = 0;
    this._steps.forEach(s => s._reset());
    this.notifyPath('_steps');
  }

  /**
   * Toggle the orientation between horizontal and vertical
   */
  toggleOrientation() {
    this.vertical = !this.vertical;
  }

  _handleStepActivate(evt) {
    /*
     * the logic here:
     * User is allowed to select any step if stepper is not linear
     * If stepper is linear:
     *  - allow user to revisit a completed editable step
     *  - allow user to revist an optional step as long as is not completed
     */
    if (this.linear) {
      const step = this._steps[evt.detail.selected];
      if (!step) return;
      if ((step.completed && step.editable) || (!step.completed && step.optional)) {
        return;
      }
      evt.preventDefault();
    }
  }

  _setSlotNames(steps, vertical) {
    if (!this._steps) return;
    steps.forEach((step, i) => {
      step.setAttribute('slot', this.vertical ? 'slot' + i : 'horizontal');
    });
  }

  _selectionChanged(selected) {
    this._steps.forEach((step, i) => {
      step.selected = i === selected;
    });
  }

  _isCompleted(steps) {
    if (!steps || steps.length === 0) return false;
    //stepper is completed when all non-optional steps are completed.
    return steps.filter(s => s.completed || s.optional).length === steps.length;
  }
}

window.customElements.define(UdStepperElement.is, UdStepperElement);

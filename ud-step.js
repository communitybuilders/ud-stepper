import './ud-iconset.js';
import {PolymerElement} from "@polymer/polymer/polymer-element";
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import {FlattenedNodesObserver} from "@polymer/polymer/lib/utils/flattened-nodes-observer";
import '@polymer/paper-styles/paper-styles.js';


/**
 * `ud-step`
 * Material Design Step
 *
 * ### Styling
 *
 * The following custom properties and mixins are available for styling:
 *
 * Custom Property | Description | Default
 * ----------------------|-------------|--------
 * `--ud-step-content-style` | Style mixin of the step content | `{}`
 * `--ud-step-continue-btn-color` | Continue button color | `--google-blue-500`
 *
 * @customElement
 * @polymer
 * @memberof UrDeveloper
 */
class UdStepElement extends PolymerElement {
  static get template() {
    return html`
    <style include="paper-styles">
      :host {
        display: flex;
        flex-direction: column;
      }

      #content {
        flex: 1;
        @apply --ud-step-content-style;
        margin: 24px 24px 16px 24px;
      }

      #actions {
        padding: 0px 24px 8px 24px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        align-items: center;
        height: 48px;
      }

      :host[hide-actions] #actions {
        display: none;
      }

      #actions ::slotted(.linear-actions),
      .linear-actions {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        flex: 1;
      }

      paper-button,
      #actions ::slotted(paper-button) {
        @apply --paper-font-button;
        color: rgba(0, 0, 0, 0.83);
      }

      .continue-btn,
      #actions ::slotted(.continue-btn) {
        color: var(--ud-step-continue-btn-color, var(--google-blue-500));
      }

      paper-button[disabled],
      #actions ::slotted(paper-button[disabled]) {
        color: rgba(0, 0, 0, 0.50);
        background-color: transparent;
      }
    </style>
    <div id="content">
      <slot name="content"></slot>
    </div>
    <div id="actions">
      <slot name="actions" id="actionsSlot">
        <paper-button data-action="back" class="back-btn">Back</paper-button>
        <paper-button data-action="skip" class="back-btn">Skip</paper-button>
      </slot>
      <div class="linear-actions">
        <slot name="linear-actions" id="linearActionsSlot">
          <paper-button data-action="cancel">Cancel</paper-button>
          <paper-button data-action="continue" class="continue-btn">Continue</paper-button>
        </slot>
      </div>
    </div>
`;
  }

  static get is() {
    return 'ud-step';
  }

  static get properties() {
    return {
      /**
       * Step title
       */
      title: {
        type: String,
        reflectToAttribute: true
      },
      /**
       * Step summary that apears under the title
       */
      summary: {
        type: String,
        reflectToAttribute: true
      },
      /**
       * Makes the step editable which in linear stepper user can go back to it.
       */
      editable: {
        type: Boolean
      },
      /**
       * Makes the step optional which allows user to skip it.
       */
      optional: {
        type: Boolean
      },

      /**
       * Determines if this is the current step in stepper.
       */
      selected: {
        type: Boolean,
        readonly: true,
        reflectToAttribute: true,
        notify: true
      },

      /**
       * Determines if the step is completed.
       */
      completed: {
        type: Boolean,
        readonly: true,
        notify: true
      },

      /**
       * The `actions` property can be used to override the default behavior of the step's actions.
       * You can define what actions are available, their texts and whether are enabled or disabled.
       * for example:
       * ```json
       *  {
       *    {
       *      name: 'continue', title: 'Next'
       *    },
       *    {
       *      name: 'cancel', title: 'Reset', disabled: true
       *    }
       *  }
       * ```
       */
      actions: {
        type: Array
      },

      /**
       * Step icon when it's not completed yet.
       * If not specified, a step number will be shown instead.
       */
      icon: {
        type: String
      },

      /**
       * Step icon when it's completed.
       */
      completedIcon: {
        type: String,
        value: 'ud:check-circle'
      },

      /**
       * Step icon when it's editable.
       */
      editableIcon: {
        type: String,
        value: 'ud:edit-circle'
      },

      /**
       * The icon that will be shown when the step is in invalid state.
       */
      errorIcon: {
        type: String,
        value: 'ud:warning'
      },

      /**
       * Text for an optional step.
       */
      optionalText: {
        type: String,
        value: 'Optional'
      },

      /**
       * Indicates if the step is in error state.
       * In a linear stepper, user cannot continue with an error state.
       */
      error: {
        type: Boolean,
        observer: '_errorChanged',
        reflectToAttribute: true
      },

      /**
       * Hide the actions bar
       */
      hideActions: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },

      _currentIcon: {
        type: String,
        computed: '_computeCurrentIcon(completed, editable, error)',
        notify: true
      },

      _actionButtons: {
        type: Array
      }
    }
  }

  static get observers() {
    return ['_updateActionsButtons(_actionButtons.*,_linearActionButtons.*,actions.*)']
  }

  ready() {
    super.ready();
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.hideActions) return;
    if (this.$.actionsSlot) {
      this._nodeObserver = new FlattenedNodesObserver(this.$.actionsSlot, (info) => {
        this._actionButtons = Array.from(info.addedNodes.filter(n => n.nodeType === Node.ELEMENT_NODE && n.hasAttribute("data-action")));
        this._actionButtons.filter(ab => !ab._hooked).forEach(ab => {
          ab.addEventListener('click', (evt) => this._handleAction(evt));
        });
      });
    }

    if (this.$.linearActionsSlot) {
      this._nodeObserver1 = new FlattenedNodesObserver(this.$.linearActionsSlot, (info) => {
        this._linearActionButtons = Array.from(info.addedNodes.filter(n => n.nodeType === Node.ELEMENT_NODE && n.hasAttribute("data-action")));
        this._linearActionButtons.filter(ab => !ab._hooked).forEach(ab => {
          ab.addEventListener('click', (evt) => this._handleAction(evt));
        });
      });
    }
  }

  _updateActionsButtons(actionButtons, linearActionButtons, allowedActions) {
    if (!allowedActions.base) return;
    let actionBtns = (actionButtons.base || []).concat(linearActionButtons.base || []);
    actionBtns.forEach(ab => {
      const actionName = ab.getAttribute('data-action');
      const action = this.actions.find(a => a.name === actionName);
      if (!action) {
        ab.style.display = 'none';
      } else {
        ab.disabled = action.disabled;
        if (action.title) {
          ab.innerText = action.title;
        }
      }
    });
  }

  _handleAction(evt) {
    this.dispatchEvent(new CustomEvent('step-action', {
      detail: evt.target.getAttribute('data-action'),
      bubbles: true
    }));
  }

  _computeCurrentIcon(completed, editable, error) {
    if (error) return this.errorIcon;
    if (completed) {
      return editable ? this.editableIcon : this.completedIcon;
    }
    return this.icon;
  }

  _errorChanged(invalid) {
    this.dispatchEvent(new CustomEvent('step-error', {
      detail: {
        stpe: this
      },
      bubbles: true
    }));
  }

  _reset() {
    this.completed = false;
  }
}

window.customElements.define(UdStepElement.is, UdStepElement);


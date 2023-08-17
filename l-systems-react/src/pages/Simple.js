import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { CenteredCol, CenteredRow, FlexRow } from '../components/layout';

const _PRESETS = [
  {
    axiom: 'X',
    rules: [
      ['F', 'FF'],
      ['X', 'F+[-F-XF-X][+FF][--XF[+X]][++F-X]'],
    ],
  },
  {
    axiom: 'FX',
    rules: [['F', 'FF+[+F-F-F]-[-F+F+F]']],
  },
  {
    axiom: 'X',
    rules: [
      ['F', 'FX[FX[+XF]]'],
      ['X', 'FF[+XZ++X-F[+ZX]][-X++F-X]'],
      ['Z', '[+F-X-F][++ZX]'],
    ],
  },
  {
    axiom: 'F',
    rules: [['F', 'F > F[+F]F[-F]F']],
  },
];

class LSystemDemo {
  constructor() {
    this._sentence = this._axiom;
    this._id = 0;

    this.OnChange();
  }

  OnChange() {
    this._UpdateFromUI();
    this._ApplyRules();
    this._Render();
  }

  _UpdateFromUI() {
    console.log('document', document.getElementById('presets'));
    const preset = document.getElementById('presets').valueAsNumber;
    this._axiom = _PRESETS[preset].axiom;
    this._rules = _PRESETS[preset].rules;

    this._iterations = document.getElementById('iterations').valueAsNumber;
    this._leafLength = document.getElementById('leaf.length').valueAsNumber;
    this._leafWidth = document.getElementById('leaf.width').valueAsNumber;
    this._leafColor = document.getElementById('leaf.color').value;
    this._leafAlpha = document.getElementById('leaf.alpha').value;
    this._branchLength = document.getElementById('branch.length').valueAsNumber;
    this._branchWidth = document.getElementById('branch.width').valueAsNumber;
    this._branchAngle = document.getElementById('branch.angle').valueAsNumber;
    this._branchColor = document.getElementById('branch.color').value;
    this._branchLengthFalloff = document.getElementById(
      'branch.lengthFalloff',
    ).value;
  }

  _FindMatchingRule(c) {
    for (let rule of this._rules) {
      if (c == rule[0]) {
        return rule;
      }
    }
    return null;
  }

  _ApplyRulesToSentence(sentence) {
    let newSentence = '';
    for (let i = 0; i < sentence.length; i++) {
      const c = sentence[i];

      const rule = this._FindMatchingRule(c);
      if (rule) {
        newSentence += rule[1];
      } else {
        newSentence += c;
      }
    }
    return newSentence;
  }

  _ApplyRules() {
    let cur = this._axiom;
    for (let i = 0; i < this._iterations; i++) {
      cur = this._ApplyRulesToSentence(cur);

      this._branchLength *= this._branchLengthFalloff;
    }
    this._sentence = cur;
  }

  _Render() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.transform(1, 0, 0, 1, canvas.width / 2, canvas.height);

    for (let i = 0; i < this._sentence.length; i++) {
      const c = this._sentence[i];

      if (c == 'F') {
        ctx.fillStyle = this._branchColor;
        ctx.fillRect(0, 0, this._branchWidth, -this._branchLength);
        ctx.transform(1, 0, 0, 1, 0, -this._branchLength);
      } else if (c == '+') {
        ctx.rotate((this._branchAngle * Math.PI) / 180);
      } else if (c == '-') {
        ctx.rotate((-this._branchAngle * Math.PI) / 180);
      } else if (c == '[') {
        ctx.save();
      } else if (c == ']') {
        ctx.fillStyle = this._leafColor;
        ctx.globalAlpha = this._leafAlpha;

        ctx.scale(this._leafWidth, this._leafLength);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(1, -1);
        ctx.lineTo(0, -4);
        ctx.lineTo(-1, -1);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    }
  }
}

const defaultSystemState = {
  presets: 2,
  iterations: 3,
  color: '#1c852b',
  branchColor: '#85521c',
  length: 2,
  width: 2,
  alpha: '0.75',
  branchLength: '30.0',
  branchWidth: '1.0',
  angle: '22.5',
  falloff: '0.75',
};

export function Simple() {
  const [demo, setDemo] = useState(null);
  // const [lengthVal, setLengthVal] = useState('2');
  const [systemState, setSystemState] = useState(defaultSystemState);

  function setSystemStateByKey(key, value) {
    setSystemState({ ...systemState, [key]: value });
    demo && demo.OnChange();
  }

  function getSystemStateByKey(key) {
    return systemState[key];
  }

  useEffect(() => {
    const Demo = new LSystemDemo();
    setDemo(Demo);
  }, []);

  return (
    <CenteredRow>
      <MenuContainer>
        <FlexRow>
          <MenuHeadingP>Presets</MenuHeadingP>
          <input
            id="presets"
            className="mdl-slider mdl-js-slider"
            type="range"
            min="0"
            max="3"
            value={getSystemStateByKey('presets')}
            onChange={(e) => setSystemStateByKey('presets', e.target.value)}
          ></input>
        </FlexRow>
        <FlexRow>
          <MenuHeadingP>Iterations</MenuHeadingP>
          <input
            id="iterations"
            className="mdl-slider mdl-js-slider"
            type="range"
            min="1"
            max="5"
            value={getSystemStateByKey('iterations')}
            onChange={(e) => setSystemStateByKey('iterations', e.target.value)}
          ></input>
        </FlexRow>
        <FlexRow>
          <MenuHeadingH1>Leaves</MenuHeadingH1>
          <ColorInput
            id="leaf.color"
            type="color"
            name="body"
            value={getSystemStateByKey('color')}
            onChange={(e) => setSystemStateByKey('color', e.target.value)}
          />
        </FlexRow>
        <FlexRow>
          <MenuHeadingP>Length</MenuHeadingP>
          <input
            id="leaf.length"
            className="mdl-slider mdl-js-slider"
            type="range"
            min="0.5"
            max="20.0"
            value={getSystemStateByKey('length')}
            onChange={(e) => setSystemStateByKey('length', e.target.value)}
          />
        </FlexRow>
        <FlexRow>
          <MenuHeadingP>Width</MenuHeadingP>
          <input
            id="leaf.width"
            className="mdl-slider mdl-js-slider"
            type="range"
            min="0.5"
            max="20.0"
            value={getSystemStateByKey('width')}
            onChange={(e) => setSystemStateByKey('width', e.target.value)}
          ></input>
        </FlexRow>
        <FlexRow>
          <MenuHeadingH1>Branches</MenuHeadingH1>
          <ColorInput
            id="branch.color"
            type="color"
            name="body"
            value={getSystemStateByKey('branchColor')}
            onChange={(e) => setSystemStateByKey('branchColor', e.target.value)}
          />
        </FlexRow>
        <FlexRow>
          <MenuHeadingP>Alpha</MenuHeadingP>
          <input
            id="leaf.alpha"
            className="mdl-slider mdl-js-slider"
            type="range"
            min="0.01"
            max="1.0"
            step="0.01"
            value={getSystemStateByKey('alpha')}
            onChange={(e) => setSystemStateByKey('alpha', e.target.value)}
          ></input>
        </FlexRow>
        <FlexRow>
          <MenuHeadingP>Length</MenuHeadingP>
          <input
            id="branch.length"
            className="mdl-slider mdl-js-slider"
            type="range"
            min="0.5"
            max="100.0"
            value={getSystemStateByKey('branchLength')}
            onChange={(e) =>
              setSystemStateByKey('branchLength', e.target.value)
            }
          ></input>
        </FlexRow>
        <FlexRow>
          <MenuHeadingP>Width</MenuHeadingP>
          <input
            id="branch.width"
            className="mdl-slider mdl-js-slider"
            type="range"
            min="0.1"
            max="10.0"
            step="0.1"
            value={getSystemStateByKey('branchWidth')}
            onChange={(e) => setSystemStateByKey('branchWidth', e.target.value)}
          ></input>
        </FlexRow>
        <FlexRow>
          <MenuHeadingP>Angle</MenuHeadingP>
          <input
            id="branch.angle"
            className="mdl-slider mdl-js-slider"
            type="range"
            min="0.1"
            max="90.0"
            step="0.1"
            value={getSystemStateByKey('angle')}
            onChange={(e) => setSystemStateByKey('angle', e.target.value)}
          ></input>
        </FlexRow>
        <FlexRow>
          <MenuHeadingP>Falloff</MenuHeadingP>
          <input
            id="branch.lengthFalloff"
            className="mdl-slider mdl-js-slider"
            type="range"
            min="0.1"
            max="1.0"
            step="0.01"
            value={getSystemStateByKey('falloff')}
            onChange={(e) => setSystemStateByKey('falloff', e.target.value)}
          ></input>
        </FlexRow>
      </MenuContainer>
      <canvas width="600px" height="800px" id="canvas" />
    </CenteredRow>
  );
}

// TODO: as we build out other examples than the 'simple' example, we likely want to move this
// (and perhaps the input form in general) into its own component
const MenuContainer = styled(CenteredCol)`
  background-color: white;
  border-radius: 0% 0% 0% 0% / 0% 0% 0% 0%;
  box-shadow: 5px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
`;

const menuHeadingStyles = css`
  margin: 0;
  width: 125px;
  max-width: 125px;
  text-align: right;
`;
const MenuHeadingP = styled.p`
  ${menuHeadingStyles}
  font-size: 1em;
`;
const MenuHeadingH1 = styled.h1`
  ${menuHeadingStyles}
  font-size: 2em;
`;
const ColorInput = styled.input`
  margin: 0 20px;
`;


class State {
    constructor(props) {
        this.state = {
            firstConversionType : null,
            secondConversionType : null
        }
    }
    getFirstSelectType() {
        return this.state.firstConversionType;
    }
    getSecondSelectType() {
        return this.state.secondConversionType;
    }
    setFirstSelectType(value) {
        this.state.firstConversionType = value;
    }
    setSecondSelectType(value) {
        this.state.secondConversionType = value;
    }
}

const state = new State;
export default state;
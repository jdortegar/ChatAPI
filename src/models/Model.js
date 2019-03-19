import _ from 'lodash';

class Model {
     /**
     * Update the object with the given object.
     * @param {Object} props 
     */
    update(props) {
        _.forOwn(props, (val, key) => {
            this[key] = val;
        });
    }

}

export default Model;
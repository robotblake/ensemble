import React from 'react';
import MetricsGraphics from 'react-metrics-graphics';
import dateformat from 'dateformat';

import 'metrics-graphics/dist/metricsgraphics.css';
import './css/PopulationColors.css';
import './css/MGDarkTheme.css';


export default props => {
    const extraOptions = {};
    const yRolloverSignificantDigits = 10;
    const yUnit = props.units.y || '';

    let yUnitString = '';
    if (yUnit) {
        if (yUnit === '%') {
            yUnitString = yUnit;
        } else {
            yUnitString = ' ' + yUnit;
        }
    }


    // The maximum and minimum y values among all populations.
    //
    // For example, for the following input, maxY would be 9 and minY would be
    // 2.
    //
    // [
    //     [
    //         { x: 1, y: 5 },
    //         { x: 2, y: 8 },
    //         { x: 3, y: 2 }
    //     ],
    //     [
    //         { x: 1, y: 7 },
    //         { x: 2, y: 9 },
    //         { x: 3, y: 4 }
    //     ]
    //  ]
    const allYValues = props.data.reduce((accumulator, currentDataset) => {
        return accumulator.concat(currentDataset.map(dataPoint => dataPoint.y));
    }, []);
    const maxY = Math.max(...allYValues);
    const minY = Math.min(...allYValues);

    // Manually choose the highest and lowest y values that should be shown on
    // the y axis, with some padding on the top so that the curve of the line
    // isn't cut off and some padding on the bottom so that the scale doesn't
    // make changes in the data appear to be more extreme than they really are.
    //
    // This works around the following issues. Once these issues have been
    // fixed, we can forego all of this math and can forego setting max_y and
    // min_y altogether and simply set min_y_from_data to true instead.
    //
    // https://github.com/mozilla/metrics-graphics/issues/822
    // https://github.com/mozilla/metrics-graphics/issues/823
    const highestY = maxY + ((maxY - minY) * .1);
    let lowestY = minY - ((maxY - minY) * 10);
    if (minY >= 0 && lowestY < 0) {
        lowestY = 0;
    }

    if (props.showLegend) {
        extraOptions.legend = props.legend;
        extraOptions.legend_target = props.legendTarget;
    }

    return (
        <MetricsGraphics
            title={props.title}
            show_tooltips={false}
            data={props.data}
            x_accessor="x"
            y_accessor="y"

            width={600}
            height={600}

            x_mouseover={dp => dateformat(dp.x, 'mmmm d, yyyy') + ': '}
            y_mouseover={dp => dp.y.toLocaleString('en-US', { maximumSignificantDigits: yRolloverSignificantDigits }) + yUnitString}

            x_label={props.labels.x}
            y_label={props.labels.y}

            x_scale_type={props.scales.x}
            y_scale_type={props.scales.y}

            max_y={highestY}
            min_y={lowestY}

            {...extraOptions}
        />
    );
};

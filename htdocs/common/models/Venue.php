<?php

namespace common\models;

use Yii;
use \common\models\base\Venue as BaseVenue;
use yii\helpers\ArrayHelper;

/**
 * This is the model class for table "venue".
 */
class Venue extends BaseVenue
{

public function behaviors()
    {
        return ArrayHelper::merge(
            parent::behaviors(),
            [
                # custom behaviors
            ]
        );
    }

    public function rules()
    {
        return ArrayHelper::merge(
             parent::rules(),
             [
                  # custom validation rules
             ]
        );
    }
}

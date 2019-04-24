<?php

namespace common\models;

use Yii;
use yii\helpers\ArrayHelper;

/**
 * This is the model class for table "ticket".
 */
class TotalCheckin extends base\TotalCheckin {
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

    /**
     * @param string $name
     * @return Tag[]
     */
    public function findCheckinToday()
    {
        $fromDate = Yii::$app->keyStorage->get('frontend.current-day');
        $sqlQuery = "select role, count(role) as total from qry_checkin where attendance > '" . $fromDate . "' group BY role ORDER BY role";
        return $sqlQuery;

    }





}

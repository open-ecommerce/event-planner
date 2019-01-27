<?php

namespace app\modules\crud\models;

use Yii;
use \app\modules\crud\models\base\QryTotalTicket as BaseQryTotalTicket;
use yii\helpers\ArrayHelper;

/**
 * This is the model class for table "qry_total_tickets".
 */
class QryTotalTicket extends BaseQryTotalTicket
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

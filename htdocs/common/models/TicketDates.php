<?php

namespace common\models;

use Yii;
use \common\models\base\TicketDates as BaseTicketDates;
use yii\helpers\ArrayHelper;

/**
 * This is the model class for table "ticket_dates".
 */
class TicketDates extends BaseTicketDates
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

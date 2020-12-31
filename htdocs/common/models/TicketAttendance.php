<?php

namespace common\models;

use Yii;
use \common\models\base\TicketAttendance as BaseTicketAttendance;
use yii\helpers\ArrayHelper;

/**
 * This is the model class for table "ticket_attendance".
 */
class TicketAttendance extends BaseTicketAttendance
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

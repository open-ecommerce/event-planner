<?php

namespace common\models;

use Yii;
use \common\models\base\Ticket as BaseTicket;
use yii\helpers\ArrayHelper;
use common\models\TicketType;

/**
 * This is the model class for table "ticket".
 */
class TotalTickets extends base\TotalTickets {
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

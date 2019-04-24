<?php
/**
 * Created by PhpStorm.
 * User: zein
 * Date: 7/4/14
 * Time: 2:31 PM
 */

namespace common\models\query;

use common\models\TicketAttendance;
use yii\db\ActiveQuery;
use yii;

class TicketQuery extends ActiveQuery
{
    public static function findLastAttendanceByTicketId($id)
    {


        $fromDate = Yii::$app->keyStorage->get('frontend.current-day');

        return TicketAttendance::find()
            ->where(['ticket_id'=>$id])
            ->andWhere('attendance > "' . $fromDate .'"')
            ->orderBy(['id' => SORT_DESC])->one();
    }
    
}

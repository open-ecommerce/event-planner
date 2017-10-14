<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205347_email_subscribers extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%email_subscribers}}',
            [
                'subscriber_id'=> $this->primaryKey(11),
                'full_name'=> $this->string(100)->null()->defaultValue(null),
                'subscriber_email'=> $this->string(100)->null()->defaultValue(null),
                'subscriber_details'=> $this->text()->null()->defaultValue(null),
                'group_id'=> $this->integer(11)->notNull(),
                'staff_id'=> $this->integer(11)->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%email_subscribers}}');
    }
}
